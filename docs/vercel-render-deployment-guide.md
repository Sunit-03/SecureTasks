# Vercel + Render Deployment Guide — SecureTasks

Deploying the Next.js client to `www.securetasks.ai` via **Vercel**, and the
Express/Prisma API + Postgres to `api.securetasks.ai` via **Render**, before
Redis or the AI layer are introduced. No servers to patch, no Nginx, no
Certbot — both platforms handle TLS and process management for you.

## Architecture for this phase

```
Vercel                              Render                    MongoDB Atlas
┌─────────────────────┐             ┌──────────────────────┐  ┌──────────────┐
│ www.securetasks.ai   │──HTTPS────▶│ api.securetasks.ai    │─▶│ Mongo cluster │
│ Next.js (git deploy) │             │ Express (web service) │  │ (M0/M10+)     │
└─────────────────────┘             └──────────────────────┘  └──────────────┘
```

DB hosting note: Render's managed database offering is PostgreSQL — it does
not offer a managed MongoDB product. So the database now lives on **MongoDB
Atlas** (its own platform) instead of alongside the API on Render. Render
still hosts the Express service; it just reaches out to Atlas over the
internet (or via VPC peering on Atlas's paid tiers) instead of an internal
Render network URL.

---

## Phase 1 — Code changes needed before deploying

Not optional — the app as it stands will break in production without these:

1. **CORS is hardcoded to localhost** — `apps/server/src/server.ts:24` has
   `origin: "http://localhost:3000"`. Change to
   `origin: "https://www.securetasks.ai"` (ideally read from an env var,
   e.g. `process.env.CLIENT_URL`, so dev still works locally).
2. **Refresh cookie is insecure for production** —
   `apps/server/src/modules/task/controllers/auth.controllers.ts:6-10` sets
   `secure: false` and `sameSite: "strict"`. For HTTPS + cross-*domain* (Vercel
   and Render are on entirely different domains under the hood, even though
   both are mapped to `*.securetasks.ai`), set `secure: true` and
   `sameSite: "none"`. This is different from the AWS single-box guide —
   there, `www` and `api` share a registrable domain end-to-end; here, the
   browser sees `www.securetasks.ai` and `api.securetasks.ai` as same-site
   *only if both custom domains are actually attached and resolving* — to be
   safe with third-party platforms in front, use `sameSite: "none"` (requires
   `secure: true`, which you want anyway).
3. **Server has no production build/start script** —
   `apps/server/package.json` only has `dev` (ts-node-dev). Add:
   ```json
   "build": "prisma generate && tsc -p tsconfig.json --outDir dist",
   "start": "node dist/server.js"
   ```
   and uncomment `"rootDir": "./src"` in `tsconfig.json` so compiled output
   preserves structure.
4. **Client env var** — `NEXT_PUBLIC_BASE_API_URL=https://api.securetasks.ai`
   set in Vercel's dashboard (not committed to `.env`).
5. **Server env vars** on Render: `DATABASE_URL` (from MongoDB Atlas — see
   Phase 2, format `mongodb+srv://...`), `PORT` (Render sets this
   automatically — read `process.env.PORT`, don't hardcode),
   `CLIENT_URL=https://www.securetasks.ai`, `JWT_ACCESS_SECRET`,
   `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY` — use
   strong, freshly generated secrets, not dev ones.
6. **Prisma schema targets Postgres, not Mongo** —
   `apps/server/prisma/schema.prisma` has `provider = "postgresql"` and
   Postgres-style `id` fields/relations. This needs a real rewrite before any
   of the above will actually run against Mongo: `provider = "mongodb"`,
   every model's id becomes `@id @default(auto()) @map("_id") @db.ObjectId`,
   and relations need to be restructured (Mongo has no foreign keys — Prisma
   models this with `ObjectId` reference fields instead). Also note: **Prisma
   Migrate doesn't support MongoDB** — there's no `prisma migrate deploy`
   step; instead you run `prisma db push` to sync the schema directly. This
   guide assumes that schema rewrite happens as its own piece of work before
   deployment — not covered step-by-step here.

Commit and push these before continuing.

## Phase 2 — MongoDB Atlas: database

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → sign up /
   log in.
2. **Create a cluster**: choose **M0 (free tier, shared)** for testing, or
   **M10+ (dedicated, ~$0.08/hr ≈ $57/month)** once you need real
   performance, backups, and VPC peering.
3. **Database Access** → add a database user (username/password or
   SCRAM auth) — this is separate from your Atlas login.
4. **Network Access** → add an IP allowlist entry. Since Render's outbound IPs
   aren't static on lower plans, either:
   - Allow `0.0.0.0/0` (all IPs) and rely on the strong DB user
     password + TLS (Atlas enforces TLS by default) — acceptable for this
     stage, or
   - On Render's paid plans, use their **Static Outbound IPs** feature and
     allowlist just those.
5. Once the cluster is up, **Connect** → **Drivers** → copy the connection
   string, which looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/securetasks?retryWrites=true&w=majority
   ```
   This becomes `DATABASE_URL` in Render's environment variables.

## Phase 3 — Render: Express API (Web Service)

1. Push your code to GitHub if it isn't already (Render deploys from git).
2. Dashboard → **New** → **Web Service** → connect your GitHub repo
   (`Sunit-03/SecureTasks`).
3. Configure:
   - **Root Directory**: `apps/server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (spins down after 15 min idle, cold-starts on next
     request — fine for testing, not for production) or **Starter**
     (~$7/month, always-on) — recommended once you're pointing a real domain
     at it.
4. **Environment variables** (Render dashboard → your service → Environment):
   ```
   DATABASE_URL=<the mongodb+srv:// connection string from Phase 2>
   CLIENT_URL=https://www.securetasks.ai
   JWT_ACCESS_SECRET=<generate a strong random string>
   JWT_REFRESH_SECRET=<generate a strong random string>
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```
   (Don't set `PORT` — Render injects it; your code should already read
   `process.env.PORT`.)
5. Deploy. Watch the build logs; once live you'll get a Render-provided URL
   like `securetasks-api.onrender.com` — confirm `https://securetasks-api.onrender.com/health`
   returns `{"success":true,...}` before wiring up the custom domain.
6. Sync the schema to Atlas. Since MongoDB doesn't support Prisma Migrate,
   this is `db push` instead of `migrate deploy`, run once from your local
   machine after the schema has been rewritten for Mongo (Phase 1, item 6):
   ```bash
   cd apps/server
   DATABASE_URL="<the mongodb+srv:// connection string>" npx prisma db push
   ```
   There's no migration history file for Mongo — `db push` just makes the
   live schema match `schema.prisma` directly.

## Phase 4 — Vercel: Next.js client

1. [vercel.com](https://vercel.com) → sign up / log in with GitHub.
2. Dashboard → **Add New** → **Project** → import `Sunit-03/SecureTasks`.
3. Configure:
   - **Root Directory**: `apps/client`
   - Framework preset: Next.js (auto-detected)
   - Build/output settings: leave defaults (`next build`)
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_BASE_API_URL=https://api.securetasks.ai
   ```
5. Deploy. You'll get a `*.vercel.app` URL first — confirm the app loads and
   hits the API correctly before attaching the custom domain.

## Phase 5 — DNS: point both subdomains

You can manage DNS from Route 53, your domain registrar, or Cloudflare —
wherever `securetasks.ai`'s nameservers currently point. Steps below assume
you're editing DNS records directly (not necessarily Route 53).

1. **Vercel side** (`www.securetasks.ai`):
   - In Vercel: Project → Settings → Domains → add `www.securetasks.ai`.
   - Vercel gives you a CNAME target (typically `cname.vercel-dns.com`).
   - In your DNS provider: add a **CNAME** record: `www` → `cname.vercel-dns.com`.
   - Optional: also add the apex `securetasks.ai` in Vercel and follow its
     instructions (usually an A record to `76.76.21.21`) if you want the
     bare domain to work too.
2. **Render side** (`api.securetasks.ai`):
   - In Render: your Web Service → Settings → Custom Domains → add
     `api.securetasks.ai`.
   - Render gives you a CNAME target (typically `<service>.onrender.com`).
   - In your DNS provider: add a **CNAME** record: `api` → the target Render
     shows you.
3. Both platforms auto-provision and renew TLS certs once the CNAME resolves
   correctly — no Certbot, no manual renewal. Propagation + cert issuance
   usually takes a few minutes to an hour.

## Phase 6 — Verify

- `https://www.securetasks.ai` loads the Next.js app on your custom domain
  with a valid cert.
- `https://api.securetasks.ai/health` returns
  `{"success":true,"status":"ok","database":"connected",...}`.
- Sign up / log in from the deployed frontend and confirm the refresh cookie
  is set correctly (DevTools → Application → Cookies →
  `api.securetasks.ai`, should show `Secure`, `HttpOnly`, `SameSite=None`).
- Check Render logs (dashboard → your service → Logs) for runtime errors.
- Check Vercel deployment logs for build/runtime errors.

## Phase 7 — Ongoing deploys

- Both platforms auto-deploy on push to your default branch (`main`) once
  connected — no manual redeploy step.
- Use Vercel's **Preview Deployments** (automatic on every PR) to test client
  changes before merging.
- Render redeploys the API on push the same way; watch the build logs since a
  failed `prisma generate` or migration will fail the deploy.

---

## Costs (see also the AWS guide's cost table for comparison)

| Item | Cost |
|---|---|
| Domain (`securetasks.ai`, `.ai` TLD) | ~$70–130/year, wherever it's registered |
| Vercel Hobby | Free — **not licensed for commercial use** |
| Vercel Pro | $20/month per user — needed once this is a real product |
| MongoDB Atlas M0 | Free (shared cluster, 512MB, no backups, testing only) |
| MongoDB Atlas M10+ | ~$57+/month (dedicated, backups, VPC peering) |
| Render Web Service | Free (sleeps after 15 min idle) or ~$7/month (Starter, always-on) |

**Rough total**: **$0–7/month** while testing on free tiers (Atlas M0 +
Render free web service), **~$84+/month** once on Vercel Pro + Render
Starter + Atlas M10 for a real launch — notably pricier than the Postgres
version of this guide, because Atlas's free/cheap tiers top out lower than
Render's own Postgres tiers before you need a dedicated cluster.

## Next phase (not covered here)

- **Redis** → Render offers a managed Redis add-on in the same region as your
  API service.
- **AI layer** → can run as a second Render Web Service (or Background
  Worker, if it doesn't need to serve HTTP), or as a Vercel Serverless
  Function if it's stateless and low-latency enough to fit that model.
