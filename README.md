# Dashboard Tax Center Web

Admin dashboard for Tax Center Gunadarma built with Next.js App Router. This app handles authenticated dashboard flows, role-based redirects, content management screens, and internal tools for the Tax Center team.

## Overview

- Built with Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query, and Axios.
- Uses cookie-based client auth state and route protection in `proxy.ts`.
- Rewrites `/api/:path*` to the staging backend at `https://stag.api.taxcenterug.com/api/:path*`.
- Production deployment is designed for Docker on a VPS, with GitHub Actions building and deploying to the server.

## Project Structure

```text
app/          Route entry points and layouts
components/   Shared UI and feature components
constant/     Shared constants such as API base values and cookie keys
hooks/        Reusable hooks
lib/          Axios client, auth helpers, and utilities
providers/    App-level providers
public/       Static assets
routes/       Route metadata/helpers
proxy.ts      Auth and role-based routing guard
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint

## API Behavior

- Browser requests use `PROXY = "/api/v1"` from `constant/constant.ts`
- Next.js rewrites `/api/:path*` to the staging API in `next.config.ts`
- Media URLs are built from `API_BASE_URL = "https://stag.api.taxcenterug.com"`

If the dashboard later needs to target production APIs, update these staging values before going live.

## VPS Deployment

This repository includes:

- `Dockerfile` for a multi-stage Next.js production image
- `docker-compose.prod.yml` for the VPS runtime
- `.github/workflows/docker-deploy.yml` for CI/CD via GitHub Actions

The production container is exposed on `127.0.0.1:3001` on the VPS host so it can run alongside the public website app without port conflicts.

Recommended VPS setup:

1. Create the deploy directory:
   ```bash
   sudo mkdir -p /opt/dashboard-taxcenter-web
   sudo chown -R <deploy-user>:<deploy-user> /opt/dashboard-taxcenter-web
   ```
2. Add GitHub Actions secrets:
   - `VPS_HOST`
   - `VPS_PORT`
   - `VPS_USER`
   - `VPS_SSH_KEY`
   - `GHCR_USERNAME`
   - `GHCR_TOKEN`
3. Push to `main` to build and deploy automatically.

## Notes

- The dashboard currently points to staging services and is best treated as a staging/internal environment until production endpoints are defined.
- If a public domain is added later, place Nginx in front of the container and proxy the chosen subdomain/domain to `127.0.0.1:3001`.
