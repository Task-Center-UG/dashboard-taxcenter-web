# Dashboard Tax Center Web

Internal dashboard for Tax Center Gunadarma. This repository is used for admin and operational workflows, including authentication, content management, activity data, volunteer data, research data, service-related data, and role-based dashboard pages.

## Overview

This dashboard is built with Next.js App Router and is intended to support internal team workflows. Access to private areas is handled in `proxy.ts`, while frontend requests are routed through `/api` rewrites so pages do not need to hardcode the API domain everywhere.

Some important context for this app:

- the landing page is available at `/`
- the main internal areas are `/dashboard` and `/dashboard-tax-volunteers`
- authentication pages live under `/auth/*`
- full metadata is only applied to the landing page
- the root app metadata is intentionally set to `noindex` because this is primarily an internal-facing application

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Axios
- Tiptap
- React Hook Form + Zod

## Project Structure

```text
app/
  auth/
  dashboard/
  dashboard-tax-volunteers/
components/
constant/
hooks/
lib/
providers/
public/
routes/
proxy.ts
```

Current structure guidelines:

- `app/**` contains routes and layouts
- `components/**` contains feature and UI components
- `lib/**` contains helpers, axios setup, auth cookie helpers, and SEO helpers
- `constant/**` contains shared constants such as `API_BASE_URL`, `PROXY`, and cookie keys
- `proxy.ts` handles redirects and role-based access control

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run a production build locally:

```bash
npm run build
npm run start
```

## Environment Variable

The dashboard currently uses:

```env
NEXT_PUBLIC_SITE_URL=https://dashboard.taxcenterug.com
```

This value is used for landing page metadata, especially:

- canonical URL
- Open Graph URL
- Twitter card URL
- `metadataBase`

If the dashboard domain or subdomain changes, update this value and redeploy.

## API Behavior

The dashboard still points to staging services.

The main places to check are:

- `constant/constant.ts`
- `next.config.ts`

Current behavior:

- `API_BASE_URL = "https://stag.api.taxcenterug.com"`
- `/api/:path*` is rewritten to `https://stag.api.taxcenterug.com/api/:path*`

So even if the dashboard itself is deployed to a production VPS, the data flow is still tied to the staging API until production endpoints are introduced.

## Metadata and OG Image

Metadata helpers live in `lib/seo.ts`.

The landing page `/` has full metadata:

- title
- description
- canonical URL
- Open Graph
- Twitter card

The dashboard uses:

```text
public/og_image.png
```

Internal dashboard pages are not intended for search indexing.

## Deployment

This repository is set up for VPS deployment on Hostinger using Docker and GitHub Actions.

Deployment files:

- `Dockerfile`
- `docker-compose.prod.yml`
- `.github/workflows/docker-deploy.yml`

On the server, the dashboard runs separately from the public website:

- deploy directory: `/opt/dashboard-taxcenter-web`
- host port: `127.0.0.1:3001`

This allows it to live alongside `taxcenter-web`, which uses port `3000`.

## GitHub Actions Secrets

This repo expects:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `GHCR_USERNAME`
- `GHCR_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

## VPS Preparation

Run this once on the server:

```bash
sudo mkdir -p /opt/dashboard-taxcenter-web
sudo chown -R <deploy-user>:<deploy-user> /opt/dashboard-taxcenter-web
```

Also make sure:

- the deploy user can log in over SSH
- the deploy user is allowed to run Docker
- internal host port `3001` is available

## Post-Deploy Checks

On the VPS:

```bash
cd /opt/dashboard-taxcenter-web
docker compose -f docker-compose.prod.yml ps
docker logs dashboard-taxcenter-web --tail 100
curl http://127.0.0.1:3001
```

If you want to test it locally before wiring a domain, use an SSH tunnel:

```bash
ssh -L 3001:127.0.0.1:3001 -p 3190 <deploy-user>@<server-ip>
```

Then open:

```text
http://localhost:3001
```

## Domain and Reverse Proxy

Once the dashboard subdomain points to the VPS, Nginx should proxy requests to:

```text
http://127.0.0.1:3001
```

SSL can be added afterward.

## Notes for the Team

- this dashboard still makes the most sense as an internal/staging-oriented app
- when the dashboard domain changes, update `NEXT_PUBLIC_SITE_URL`
- if the backend moves from staging to production, review both `next.config.ts` and `constant/constant.ts`
- if the landing page changes significantly, its metadata should be reviewed as well
