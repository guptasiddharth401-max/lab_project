# Library SaaS — Self-Serve Run Guide

This guide is intended to help a developer or operator get the Library SaaS app running locally or on a small production-like environment without needing external support.

## 1) Prerequisites

Required:
- Node.js 18+
- npm 9+
- Docker + Docker Compose
- PostgreSQL 15+ (or use the provided Docker service)
- Git

## 2) Clone and install

```bash
git clone https://github.com/guptasiddharth401-max/lab_project.git
cd lab_project
npm install
```

## 3) Configure environment

From the repo root:

```bash
cp .env.example .env
```

Then review `.env` and adjust values as needed. The default values are safe for local development, but production deployments should use secret values and a real DB password.

Important environment variables:
- `DATABASE_URL`
- `SESSION_SECRET`
- `API_PORT`
- `ALLOWED_ORIGINS`
- `DEFAULT_TIMEZONE`

## 4) Start the database

```bash
docker-compose up -d postgres
```

This starts PostgreSQL on `localhost:5432`.

## 5) Generate Prisma client and apply schema

```bash
cd packages/database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Or, from the repo root:

```bash
npm run db:migrate
npm run db:seed
```

## 6) Start the app

Run both API and web app together:

```bash
npm run dev
```

This starts:
- API: http://localhost:3000/api/v1
- Web app: http://localhost:3001
- Health endpoint: http://localhost:3000/health

## 7) Default login credentials

The seed data includes sample accounts:

- Owner: `owner@library.com` / `owner@123`
- Manager: `manager@library.com` / `manager@123`
- Receptionist: `receptionist@library.com` / `receptionist@123`
- Accountant: `accountant@library.com` / `accountant@123`

## 8) Production-like local verification

Use these checks after starting the app:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/auth/me
```

If the session is active, the login flow should return a valid authenticated user object.

## 9) Core operational checks

Before calling the app production-ready for your environment, validate:
- login succeeds with seeded credentials
- auth cookie is set and session is validated
- RBAC blocks unauthorized actions
- student creation rejects duplicate code/mobile numbers
- payment creation processes a positive amount and generates receipt
- internet access denies blocked, expired, or overdue cases
- health endpoint responds successfully

## 10) Troubleshooting

### Database connection error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify `docker-compose` service is healthy

### Prisma errors
- Run `npx prisma generate`
- Ensure migrations are applied
- Delete and recreate local DB if necessary for a clean reset

### Port conflicts
- Ensure nothing is using `3000` or `3001`
- Adjust your environment variables if needed

### Session/Cookie issues
- Confirm frontend requests include credentials
- Verify `httpOnly` cookies are allowed in browser settings
- Use secure mode only in production deployments

## 11) Production deployment notes

For a real production deployment:
- use a real PostgreSQL instance, not local containers
- set strong `SESSION_SECRET` values
- use HTTPS only
- restrict CORS to trusted origins
- rotate secrets and avoid committing `.env` files
- run backups and log retention schedules
- use a reverse proxy or ingress
- keep database, app, and audit logs separate

## 12) Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run db:migrate
npm run db:seed
```

## 13) Support

For repo issues or configuration help, open a GitHub issue or review the project specification in `copilot.md`.
