# Library SaaS — Production Runbook

This runbook captures the operational workflow for running and validating Library SaaS in a local development or small production-like environment.

## Overview

Library SaaS is a multi-tenant library management system with the following core flows:
- user authentication and sessions
- library and student management
- seat assignment
- payment collection and fee allocation
- attendance and membership tracking
- internet access policy checks
- operational health and auditing

## Repository layout

```bash
apps/
  api/    # NestJS backend
  web/    # Next.js frontend
packages/
  database/
  types/
  validation/
  config/
```

## Start locally

```bash
git clone https://github.com/guptasiddharth401-max/lab_project.git
cd lab_project
npm install
cp .env.example .env
docker-compose up -d postgres
npm run db:migrate
npm run db:seed
npm run dev
```

## Verify services

Check the API:

```bash
curl http://localhost:3000/health
```

Check the app frontend:
- http://localhost:3001

## Authentication

Use seeded users for verification:
- Owner: owner@library.com / owner@123
- Manager: manager@library.com / manager@123
- Receptionist: receptionist@library.com / receptionist@123
- Accountant: accountant@library.com / accountant@123

## Operational checks to run

1. Login successfully.
2. Ensure cookie-based session is created.
3. Confirm unauthorized role requests fail.
4. Attempt duplicate student creation to validate rejection.
5. Record a payment with a positive amount.
6. Verify fee allocation and receipt creation.
7. Verify internet access checks block expired or overdue scenarios.
8. Confirm health endpoint returns healthy status.
9. Review audit log entries for staff/admin-sensitive activity.

## Production readiness checklist

- HTTPS enabled
- `SESSION_SECRET` set to a secure secret
- environment variables not committed
- database credentials not exposed
- CORS restricted to trusted origins
- tenant isolation enforced from server-side user context
- audit logs enabled
- backups configured
- monitoring and health checks enabled

## Troubleshooting

- If Prisma fails: run `npx prisma generate` and `npm run db:migrate`
- If DB is unavailable: ensure Docker is running and the Postgres container is healthy
- If session is invalid: clear cookies and log in again
- If access is denied unexpectedly: check RBAC and library context logic

## Support

For additional support, inspect the repository docs and the project specification in `copilot.md`.
