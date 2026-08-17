# AWS Deployment Guide — SecureTasks

Deploying the Next.js client to `www.securetasks.ai` and the Express/Prisma API to
`api.securetasks.ai`, before Redis or the AI layer are introduced.

## Architecture for this phase

```
Route 53 (DNS)
   ├─ www.securetasks.ai ─┐
   └─ api.securetasks.ai ─┤
                           ▼
                  EC2 (Ubuntu, t3.small)
                  ├─ Nginx (80/443, reverse proxy + Let's Encrypt)
                  ├─ Next.js  (pm2, port 3000)  ← www
                  └─ Express  (pm2, port 5000)  ← api
                           │
                           ▼
                  RDS PostgreSQL (private subnet, t3.micro)
```

Single EC2 box for now (cheapest, simplest). Redis (ElastiCache) and an AI worker
process can be added later on top of this without restructuring anything below.

---

## Phase 1 — AWS account & networking

1. **Create/confirm AWS account**, set up billing alerts (Billing → Budgets → create
   a budget alert, e.g. $20/mo).
2. **IAM**: don't use the root account day-to-day. Create an IAM user with
   `AdministratorAccess` (or scoped EC2/RDS/Route53 policies), enable MFA, use that.
3. Use the **default VPC** in your chosen region (e.g. `ap-south-1` or `us-east-1`) —
   no need for a custom VPC at this stage.
4. **Security Groups** (create two):
   - `sg-web`: inbound 22 (SSH, restrict to your IP only), 80, 443 from
     `0.0.0.0/0`; outbound all.
   - `sg-db`: inbound 5432 **only from `sg-web`** (not from the internet);
     outbound all.

## Phase 2 — RDS PostgreSQL

1. RDS → Create database → PostgreSQL → **Free tier / db.t3.micro** (single-AZ is
   fine pre-launch).
2. DB name: `securetasks`, master username/password — save these somewhere secure
   (not in chat, not in git).
3. **Public access: No**. VPC security group: `sg-db`.
4. Once created, note the endpoint hostname, e.g.
   `securetasks-db.xxxxx.ap-south-1.rds.amazonaws.com`.
5. Your `DATABASE_URL`:
   ```
   postgresql://<user>:<password>@<endpoint>:5432/securetasks?schema=public
   ```

## Phase 3 — EC2 instance

1. EC2 → Launch instance: **Ubuntu 22.04 LTS**, `t3.small` (t3.micro will be tight
   for a Next.js build), attach `sg-web`, create/download a key pair
   (`securetasks.pem`).
2. Allocate an **Elastic IP** and associate it with the instance (so the IP doesn't
   change on reboot).
3. SSH in:
   ```bash
   ssh -i securetasks.pem ubuntu@<elastic-ip>
   ```
4. Install base tooling:
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   sudo npm install -g pm2
   node -v && npm -v
   ```

## Phase 4 — DNS (Route 53)

1. If `securetasks.ai` isn't already registered, register it (Route 53 →
   Registered Domains, or transfer it in from wherever you bought it).
2. Route 53 → Hosted zones → create a hosted zone for `securetasks.ai` (if not
   auto-created on registration).
3. Add two **A records** pointing at your EC2 Elastic IP:
   - `www.securetasks.ai` → Elastic IP
   - `api.securetasks.ai` → Elastic IP
4. If the domain is registered elsewhere, set that registrar's nameservers to the
   4 NS records Route 53 gives you for the hosted zone.
5. Wait for propagation (`dig www.securetasks.ai` should return your Elastic IP).

## Phase 5 — Code changes needed before deploying

Not optional — the app as it stands will break in production without these:

1. **CORS is hardcoded to localhost** — `apps/server/src/server.ts:24` has
   `origin: "http://localhost:3000"`. Change to
   `origin: "https://www.securetasks.ai"` (ideally read from an env var so dev
   still works locally).
2. **Refresh cookie is insecure for production** —
   `apps/server/src/modules/task/controllers/auth.controllers.ts:6-10` sets
   `secure: false` and `sameSite: "strict"`. For HTTPS + cross-subdomain (`www`
   calling `api`), set `secure: true` and `sameSite: "lax"` (or `"none"` only if
   you ever call the API from a different registrable domain — not needed here
   since both are `*.securetasks.ai`).
3. **Server has no production build/start script** — `apps/server/package.json`
   only has `dev` (ts-node-dev). Add:
   ```json
   "build": "tsc -p tsconfig.json --outDir dist",
   "start": "node dist/server.js"
   ```
   and uncomment `"rootDir": "./src"` in `tsconfig.json` so compiled output
   preserves structure.
4. **Client env var** — `apps/client/.env` (or set directly on the server, not
   committed) needs `NEXT_PUBLIC_BASE_API_URL=https://api.securetasks.ai`.
5. **Server env vars** on the box: `DATABASE_URL`, `PORT=5000`,
   `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRY`,
   `REFRESH_TOKEN_EXPIRY` — use strong, freshly generated secrets for production,
   not dev ones.

Commit and push these before continuing.

## Phase 6 — Deploy the code to EC2

```bash
# on the EC2 box
cd /home/ubuntu
git clone https://github.com/Sunit-03/SecureTasks.git
cd SecureTasks

# server
cd apps/server
nano .env        # paste production DATABASE_URL, JWT secrets, PORT=5000
npm install
npx prisma generate
npx prisma migrate deploy      # applies migrations against RDS
npm run build
pm2 start dist/server.js --name securetasks-api

# client
cd ../client
nano .env        # NEXT_PUBLIC_BASE_API_URL=https://api.securetasks.ai
npm install
npm run build
pm2 start npm --name securetasks-web -- start   # runs `next start` on port 3000

pm2 save
pm2 startup       # follow the printed sudo command so pm2 survives reboots
```

## Phase 7 — Nginx reverse proxy + TLS

1. Create `/etc/nginx/sites-available/securetasks`:
   ```nginx
   server {
       listen 80;
       server_name www.securetasks.ai;
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }

   server {
       listen 80;
       server_name api.securetasks.ai;
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
2. Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/securetasks /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
3. Get free TLS certs for both subdomains:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d www.securetasks.ai -d api.securetasks.ai
   ```
   Certbot rewrites the Nginx config to redirect 80→443 and auto-renews via a
   systemd timer (`sudo certbot renew --dry-run` to verify).
4. Optional root-domain redirect: if you want `securetasks.ai` (no `www`) to
   work, add an A record for the apex to the Elastic IP and a matching Nginx
   server block that 301-redirects to `https://www.securetasks.ai`.

## Phase 8 — Verify

- `https://www.securetasks.ai` loads the Next.js app.
- `https://api.securetasks.ai/health` returns
  `{"success":true,"status":"ok","database":"connected",...}`.
- Sign up / log in from the deployed frontend and confirm the refresh cookie is
  being set (DevTools → Application → Cookies, should show `Secure` +
  `HttpOnly` on `api.securetasks.ai`).
- `pm2 logs` on the box to watch for runtime errors.

## Phase 9 — Baseline hardening/ops (do before real traffic)

- Restrict SSH security group to your actual IP (not `0.0.0.0/0`).
- Set up **RDS automated backups** (on by default, confirm retention window,
  e.g. 7 days).
- Enable **EC2 auto-recovery** or at least a CloudWatch alarm on instance status
  checks.
- `helmet()` and `express-rate-limit` are already in the server — confirm the
  rate limiter config is sane for production traffic.
- Rotate the JWT secrets and DB password out of your shell history
  (`history -c` if typed raw) and store them in a password manager or AWS
  Secrets Manager if you want to go further.

---

## Next phase (not covered here)

- **Redis** → ElastiCache instance in the same VPC, security group opened only
  to `sg-web`.
- **AI layer** → a second PM2 process on the same box, or a separate
  EC2/Lambda, once traffic warrants isolating it.
