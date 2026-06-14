# Deploy backend to Render (quick guide)

This document describes how to deploy the `firstcodes` backend to Render using the repository `juliusosesebaga-ui/my-repo` and the included `render.yaml` service manifest.

Important notes
- The current backend uses a JSON file (`data/db.json`) for persistence. Render's deployments are ephemeral — the file will be lost on redeploys. For production, use a managed database (Postgres) or object storage (S3) and update `db.js` accordingly.
- Do NOT store real secrets in `render.yaml` — set them in the Render dashboard as environment variables (the manifest includes placeholders for convenience).

Steps (automatic via `render.yaml`)
1. Sign in to https://render.com and create a new service.
2. Click **New** → **Web Service** → **Connect a repository** and pick `juliusosesebaga-ui/my-repo`.
3. Render will detect `render.yaml` and use it to create a service named `church-ibafo-backend`.
4. In the service settings, open **Environment** → **Environment Secrets** and set the following variables (use secure values for `ADMIN_TOKEN`):
   - `ADMIN_USER` = custodian
   - `ADMIN_PASS` = custoelite123
   - `ADMIN_TOKEN` = <your-secret-token>
   - `DB_FILE` = firstcodes/firstcodes-backend/data/db.json
5. Start the service. Render will run the `buildCommand` and `startCommand` from `render.yaml`.

Manual setup (if you prefer UI):
- Repo: `juliusosesebaga-ui/my-repo`
- Branch: `main`
- Root: leave blank (we use `cd` in build/start commands)
- Build command: `cd firstcodes/firstcodes-backend && npm install`
- Start command: `cd firstcodes/firstcodes-backend && npm start`
- Environment: add same env vars as above.

Health check & verification
- After deploy, check: `https://<your-render-service>.onrender.com/api/health` should return `{"ok":true}`.
- Check sermons: `https://<your-render-service>.onrender.com/api/sermons`.

Expose the frontend
- If you deploy frontend separately (Vercel/Netlify), update `firstcodes/script.js` `API_BASE` to `https://<your-render-service>.onrender.com`.

Persistent data recommendation
- For production, switch from file persistence to a small managed DB (Postgres) or use object storage for the JSON file and update `db.js` accordingly. I can prepare a migration script if you want.
