# Library SaaS

A production-oriented, low-cost, multi-tenant SaaS platform for study libraries and reading rooms.

## Overview

Library SaaS replaces manual library management with an integrated system for:
- Admissions and memberships
- Seat allocation and management
- Fee collection and financial tracking
- Attendance monitoring
- Managed library Wi-Fi access
- Student communication and notifications

**Core Principle:** "Complexity belongs in the software, not with the customer."

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ with React 18+
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** React hooks + Context API
- **Architecture:** Mobile-first PWA

### Backend
- **Framework:** NestJS
- **Language:** TypeScript (strict mode)
- **API:** REST (/api/v1)
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Validation:** class-validator, class-transformer

### Infrastructure
- **Containerization:** Docker
- **Composition:** Docker Compose (local), Linux VPS (production)
- **Proxy:** Cloudflare
- **Router:** OpenWrt with openNDS
- **Monorepo:** Turborepo

## Repository Structure

```
library-saas/
├── apps/
│   ├── api/              # NestJS Backend
│   └── web/              # Next.js Frontend
├── packages/
│   ├── database/         # Prisma schema & migrations
│   ├── types/            # Shared TypeScript types
│   ├── validation/       # Shared validation rules
│   └── config/           # Shared configuration
├── docs/                 # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- npm or yarn

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/guptasiddharth401-max/lab_project.git
   cd lab_project
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d postgres
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings (should work as-is for local dev)
   ```

4. **Initialize database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

   - **Backend API:** http://localhost:3000
   - **Frontend:** http://localhost:3001

## Development

### Available Commands

```bash
# Development
npm run dev          # Start all services in watch mode

# Type checking
npm run type-check   # Check TypeScript in all packages

# Linting
npm run lint         # Lint all packages

# Testing
npm run test         # Run tests across all packages

# Building
npm run build        # Build all packages for production

# Database
npm run db:migrate   # Create/apply database migrations
npm run db:seed      # Seed database with test data
```

### Code Style

- **TypeScript:** Strict mode enforced
- **Linting:** ESLint + Prettier
- **Format:** 2-space indentation
- **Naming:** camelCase (variables), PascalCase (classes/types)

See [Development Guidelines](./docs/DEVELOPMENT.md) for detailed standards.

## Development Phases

- **Phase 1A:** ✅ Foundation (monorepo setup, core infrastructure)
- **Phase 1B:** Library Management (seats, sections, shifts, plans, students, admissions)
- **Phase 1C:** Financial System (fees, payments, receipts, cash closing)
- **Phase 1D:** Operations (attendance, dashboard, health, alerts)
- **Phase 1E:** Student Portal (login, OTP, membership, payments)
- **Phase 1F:** Internet Management (devices, access rules, guests)
- **Phase 1G:** Router Integration (enrollment, agent, openNDS)
- **Phase 1H:** Hardening (security, audit, backups, monitoring)

## Multi-Tenancy

Every record is tenant-isolated. The authenticated user's library context determines access.

**Golden Rule:** NEVER trust `libraryId` from the frontend. Derive it from the authenticated user's context on the backend.

## Security Principles

- ✅ HTTPS only
- ✅ Secure HttpOnly cookies for sessions
- ✅ Server-side session management
- ✅ Input validation on all endpoints
- ✅ Role-based access control (RBAC)
- ✅ Audit logging for sensitive actions
- ✅ No secrets in frontend
- ✅ Private database
- ✅ Automated backups

## Initial Library (Seed Data)

**Name:** ABC Library  
**Capacity:** 80 seats

### Blocks
- **Block A:** A01–A40
- **Block B:** B01–B40

### Shifts
- **Morning:** 06:30–12:00
- **Evening:** 12:00–18:00
- **Full Day:** 06:30–18:00

## API Modules (Planned)

Base URL: `/api/v1`

- `/auth` — Authentication & sessions
- `/users` — Staff management
- `/students` — Student records
- `/admissions` — Memberships
- `/seats` — Seat allocation
- `/payments` — Financial transactions
- `/fees` — Fee management
- `/attendance` — Check-in/out
- `/internet` — Wi-Fi access control
- `/dashboard` — Owner dashboard
- `/audit` — Audit logs
- `/settings` — Configuration

## Testing

Critical business rules are tested:
- Student creation & validation
- Seat assignment & conflicts
- Admission activation
- Fee calculation
- Payment allocation
- Attendance tracking
- Internet access decisions
- Device limits
- Tenant isolation
- RBAC enforcement

Run: `npm run test`

## Project Specification

Full specification available in `copilot.md` - comprehensive requirements for all 50+ features.

## License

Proprietary — Library SaaS

## Support

For issues or questions, create a GitHub issue.
