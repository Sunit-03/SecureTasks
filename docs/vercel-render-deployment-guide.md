# Vercel + Render Deployment Guide — SecureTasks

Deploying the Next.js client via **Vercel** and the Express/Prisma API +
Postgres via **Render**, using each platform's free tier end-to-end, before
Redis or the AI layer are introduced. No servers to patch, no Nginx, no
Certbot — both platforms handle TLS and process management for you.

This version stays on the **existing Postgres/Prisma setup** — no schema
changes required. The DB lives on **Neon**, since Render's own free Postgres
tier expires after 90 days and Neon's does not.

Two domain paths, pick one:
- **Fully free**: skip buying `securetasks.ai` for now and use the free
  URLs each platform gives you (`*.vercel.app`, `*.onrender.com`). Everything
  in this guide works exactly the same either way — only Phase 5 (custom
  domains) is skipped.
- **Custom domain**: buy `securetasks.ai` and wire up `www`/`api` as before
  (Phase 5) — the only cost in this whole guide.

## Architecture for this phase

```
Vercel                               Render                    Neon
┌──────────────────────┐             ┌───────────────────────┐  ┌──────────────┐
│ www.securetasks.ai    │──HTTPS────▶│ api.securetasks.ai     │─▶│ Postgres     │
│ (or *.vercel.app)     │             │ (or *.onrender.com)   │  │ (free tier)  │
│ Next.js (git deploy)  │             │ Express (web service) │  └──────────────┘
└──────────────────────┘             └───────────────────────┘
```

---

## Phase 1 — Code changes needed before deploying

These are still hardcoded in the codebase as of this guide — left as-is for
now, but they need to change before the app will work in production (whether
you use the free `*.vercel.app`/`*.onrender.com` URLs or a custom domain):

1. **CORS is hardcoded to localhost** — `apps/server/src/server.ts:24` has
   `origin: "http://localhost:3000"`. Needs to change to whatever your
   deployed client URL actually is — either `https://www.securetasks.ai`
   (custom domain) or `https://<your-project>.vercel.app` (free path).
   Ideally read from an env var, e.g. `process.env.CLIENT_URL`, so dev still
   works locally and you don't have to edit code when the URL changes.
2. **Refresh cookie is insecure for production** —
   `apps/server/src/modules/task/controllers/auth.controllers.ts:6-10` sets
   `secure: false` and `sameSite: "strict"`. Vercel and Render are always on
   different underlying domains regardless of whether you attach
   `*.securetasks.ai` on top — so this needs `secure: true` and
   `sameSite: "none"` (browsers require `secure: true` whenever
   `sameSite: "none"` is used).
3. **Server has no production build/start script** —
   `apps/server/package.json` only has `dev` (ts-node-dev). Needs:
   ```json
   "build": "prisma generate && tsc -p tsconfig.json --outDir dist",
   "start": "node dist/server.js"
   ```
   and `"rootDir": "./src"` uncommented in `tsconfig.json` so compiled output
   preserves structure.

Commit and push these before continuing — Render and Vercel both deploy from
git, so nothing above takes effect until it's pushed.

4. **Client env var** — `NEXT_PUBLIC_BASE_API_URL` set in Vercel's dashboard
   (not committed to `.env`) to whatever your Render service URL is:
   `https://api.securetasks.ai` (custom domain) or
   `https://<your-service>.onrender.com` (free path).
5. **Server env vars** on Render: `DATABASE_URL` (from Neon — see Phase 2),
   `PORT` (Render sets this automatically — read `process.env.PORT`, don't
   hardcode), `CLIENT_URL` (matching whichever client URL you use),
   `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRY`,
   `REFRESH_TOKEN_EXPIRY` — use strong, freshly generated secrets, not dev
   ones.

## Phase 2 — Neon: PostgreSQL database

1. [neon.tech](https://neon.tech) → sign up / log in (GitHub login is
   easiest).
2. **Create a project**: name it `securetasks`, pick a region close to
   Render's region (matters a little for latency, not for cost).
3. Free tier: 0.5GB storage, autosuspends after a period of inactivity and
   wakes automatically on the next query (a few hundred ms delay on a cold
   query) — no expiry, unlike Render's free Postgres.
4. **Dashboard → Connection Details** → copy the pooled connection string,
   which looks like:
   ```
   postgresql://<user>:<password>@<endpoint>-pooler.<region>.aws.neon.tech/securetasks?sslmode=require
   ```
   Use the **pooled** connection string (not direct) for the app's
   `DATABASE_URL` — Render's free/low tiers plus Prisma's connection handling
   benefit from Neon's built-in PgBouncer pooling.
5. This connection string becomes `DATABASE_URL` in Render's environment
   variables. No schema changes needed — it's the same `provider =
   "postgresql"` already in `schema.prisma`.

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
   DATABASE_URL=<the pooled Neon connection string from Phase 2>
   CLIENT_URL=<your Vercel URL — custom domain or *.vercel.app>
   JWT_ACCESS_SECRET=<generate a strong random string>
   JWT_REFRESH_SECRET=<generate a strong random string>
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```
   (Don't set `PORT` — Render injects it; your code should already read
   `process.env.PORT`.)
5. Deploy. Watch the build logs; once live you'll get a Render-provided URL
   like `securetasks-api.onrender.com` — confirm
   `https://securetasks-api.onrender.com/health` returns `{"success":true,...}`.
   If you're skipping the custom domain, this URL *is* your API endpoint —
   use it directly in Phase 4.
6. Apply the Prisma migrations against Neon (same as any Postgres target —
   no `db push` workaround needed). Easiest from your local machine:
   ```bash
   cd apps/server
   DATABASE_URL="<the Neon connection string>" npx prisma migrate deploy
   ```

## Phase 4 — Vercel: Next.js client

1. [vercel.com](https://vercel.com) → sign up / log in with GitHub.
2. Dashboard → **Add New** → **Project** → import `Sunit-03/SecureTasks`.
3. Configure:
   - **Root Directory**: `apps/client`
   - Framework preset: Next.js (auto-detected)
   - Build/output settings: leave defaults (`next build`)
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_BASE_API_URL=<your Render service URL from Phase 3>
   ```
5. Deploy. You'll get a `*.vercel.app` URL — confirm the app loads and hits
   the API correctly. **If you're going fully free, you're done** — this
   `*.vercel.app` URL is your live app; skip Phase 5.

## Phase 5 — Optional: custom domain (`securetasks.ai`)

Only needed if you've bought the domain. Skip this whole phase if you're
running on the free `*.vercel.app`/`*.onrender.com` URLs.

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

- Your client URL (`https://www.securetasks.ai` or `https://<project>.vercel.app`)
  loads the Next.js app with a valid cert.
- Your API URL's `/health` endpoint (e.g.
  `https://securetasks-api.onrender.com/health`) returns
  `{"success":true,"status":"ok","database":"connected",...}`.
- Sign up / log in from the deployed frontend and confirm the refresh cookie
  is set correctly (DevTools → Application → Cookies → your API domain,
  should show `Secure`, `HttpOnly`, `SameSite=None`).
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
| Domain (`securetasks.ai`, `.ai` TLD) | ~$70–130/year — **only cost in the fully-free path, and only if you buy it** |
| Vercel Hobby | Free — **not licensed for commercial use**, fine while building |
| Vercel Pro | $20/month per user — only needed once this is a real commercial product |
| Neon free tier | Free — no expiry, autosuspends when idle |
| Render Web Service (Free) | Free — sleeps after 15 min idle, cold-starts on next request |
| Render Web Service (Starter) | ~$7/month — always-on, only needed once cold starts are unacceptable |

**Fully free total: $0/month**, on `*.vercel.app` + `*.onrender.com` +
Neon free tier — this is the setup to use right now. The only unavoidable
cost anywhere in this guide is the domain itself, and only once you choose
to buy one.

## Next phase (not covered here)

- **Redis** → Render offers a managed Redis add-on in the same region as your
  API service.
- **AI layer** → can run as a second Render Web Service (or Background
  Worker, if it doesn't need to serve HTTP), or as a Vercel Serverless
  Function if it's stateless and low-latency enough to fit that model.
