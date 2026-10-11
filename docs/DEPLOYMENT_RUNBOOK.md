# Library SaaS - Deployment Runbook for Owners and Operators

This runbook is for owners, operators, and technical administrators who manage the local deployment, environment, uptime, and operational health of the Library SaaS platform.

---

## 1. Purpose

This document explains how to run the Library SaaS app in a local or production environment and what to monitor after deployment.

It is intended for non-technical owners and technical operators working together.

---

## 2. Deployment Overview

The project is built as a modular monolith with:

- Next.js web app
- NestJS API
- PostgreSQL database
- Prisma ORM
- Docker-based local orchestration

Primary deployment pattern:

- Docker Compose for local development
- Linux VPS or cloud server for production deployment
- Nginx or reverse proxy for external access
- Cloudflare for DNS and security

---

## 3. Prerequisites

### Local environment

- Docker Desktop or Docker Engine
- Docker Compose
- Node.js 18+ recommended
- npm or pnpm
- Git

### Production environment

- Ubuntu or Debian Linux server
- Docker + Docker Compose
- PostgreSQL or containerized database
- domain/subdomain configured
- SSL certificate
- backup automation

---

## 4. Local Setup

### Step 1: Clone repository

```bash
git clone https://github.com/guptasiddharth401-max/lab_project.git
cd lab_project
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Copy example files and update values.

```bash
cp .env.example .env
cp apps/api/src/.env.example apps/api/src/.env
```

Set database, auth, and app settings as required.

### Step 4: Start services

```bash
docker-compose up -d
```

This starts the support services and app containers required for the platform.

### Step 5: Run migrations

```bash
npx prisma migrate dev
```

If needed, initialize seed data.

### Step 6: Launch app

```bash
npm run dev
```

Check application health from the browser.

---

## 5. Production Deployment Checklist

Before going live, verify all of the following:

- database is provisioned and reachable
- environment variables are set correctly
- API keys and secrets are not hardcoded
- SSL is active
- backend and web app are reachable
- auth cookies are secure in production
- CORS and allowed origins are configured
- backup job is enabled
- health check endpoint is monitored

---

## 6. Production Architecture

Recommended production flow:

1. Host the app on a Linux VPS or managed server
2. Put the web app behind a reverse proxy
3. Route API requests to the NestJS service
4. Use PostgreSQL for data persistence
5. Use Cloudflare for DNS, caching, and HTTPS
6. Enforce secure cookies and proper Domain/SameSite rules

---

## 7. Key Environment Variables

Set the following values securely:

- DATABASE_URL
- JWT_SECRET or session secret
- APP_PORT
- NEXT_PUBLIC_API_URL
- API_BASE_URL
- NODE_ENV=production
- COOKIE_SECRET
- SMTP or notification credentials

Do not commit real secrets to Git.

---

## 8. Database and Migrations

### Migration process

```bash
npx prisma migrate deploy
```

### Validation

After migration:

- confirm tables exist
- confirm admins and initial library seed data are present
- verify required permissions are set

### Backup procedure

Take a regular pg_dump backup:

```bash
pg_dump -U <user> -h <host> <database> > backup.sql
```

Store backups securely and test restoration periodically.

---

## 9. Health and Uptime Monitoring

Operators should monitor:

- web app availability
- API uptime
- database health
- disk usage
- CPU and memory usage
- network or router status
- failed payment syncs
- blocked Wi-Fi sessions

### Suggested alerts

- API down for more than 5 minutes
- database connection failure
- disk usage > 85%
- router offline for more than 10 minutes
- payment errors or refund anomalies

---

## 10. Daily Operational Checklist

### Every day

- [ ] check app health
- [ ] confirm the database is reachable
- [ ] review payment totals
- [ ] check outstanding dues
- [ ] review router or internet status
- [ ] inspect health alerts
- [ ] confirm no critical issue remains open

### Weekly

- [ ] review logs for failed transactions
- [ ] verify migrations are up to date
- [ ] confirm backups succeeded
- [ ] check disk and memory usage
- [ ] review analytics/health trends

---

## 11. Security Checklist

Before production launch or after updates, verify:

- HTTPS is enforced
- secure cookies are enabled
- admin access is restricted
- secrets are stored in environment variables
- no real data is used in development
- backups are encrypted and protected
- logs are retained and reviewed
- no default passwords remain in production

---

## 12. Common Deployment Issues

### Issue: App does not start

Check:

- Docker engine is running
- environment variables are valid
- database is reachable
- ports are not occupied
- migration status is correct

### Issue: Database connection error

Check:

- DATABASE_URL is correct
- database container is running
- password and host values match
- SSL or networking settings are valid

### Issue: Web app loads but API fails

Check:

- API container logs
- network connection between app and API
- env values for API URL
- TLS, port, and host configuration

### Issue: Student login fails

Check:

- password is correct
- account is active
- role permissions are assigned correctly
- session cookies are not being blocked

---

## 13. Rolling Back a Deployment

If a release causes issues:

1. stop the affected container or app service
2. revert to the previous working build or git commit
3. run database migration rollback if needed
4. verify app health and login
5. investigate before redeploying

Important: do not silently roll back without checking whether data migration is reversible.

---

## 14. Owner Communication Template

For status updates, share a simple summary like:

```
System Status: Healthy
Last checked: 9:00 AM
Active students: 142
Outstanding dues: ₹18,500
Payments today: ₹9,200
Wi-Fi status: Stable
Alert status: 2 warnings, 0 critical

Action required: None
```

This keeps business owners informed without exposing technical details.

---

## 15. Useful Commands

### Start app

```bash
docker-compose up -d
npm run dev
```

### Stop app

```bash
docker-compose down
```

### Run Prisma migration

```bash
npx prisma migrate dev
```

### Production migration

```bash
npx prisma migrate deploy
```

### Check logs

```bash
docker-compose logs -f
```

---

## 16. Final Operational Advice

Think of the platform like a library operating system:

- uptime matters
- data accuracy matters
- financial records matter
- student access must be fair and consistent
- internet access must be governed by policy

The system works best when owners, staff, and operators follow the same workflow and keep the audit trail clean.

---

This is the deployment and operations runbook for owners and operators.
