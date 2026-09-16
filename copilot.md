# LIBRARY SAAS — MASTER PROJECT SPECIFICATION

## 1. PROJECT OVERVIEW

Build a production-oriented, low-cost, multi-tenant SaaS platform for study libraries / reading rooms.

The first real deployment will be for an 80-seat study library.

The product will manage:

- Students
- Memberships/admissions
- Seats
- Blocks and sections
- Shifts
- Fee plans
- Fee cycles
- Payments
- Concessions
- Dues
- Receipts
- Cash closing
- Attendance
- Student history
- Internet access
- Student devices
- Guests
- Router management
- Notifications
- Requests/help
- Dashboard
- Library Health
- Reports
- Audit logs
- Roles and permissions

The product must be designed so that the first customer can operate it without technical knowledge.

CORE PRINCIPLE:

"Complexity belongs in the software, not with the customer."

The architecture should support multiple libraries in the future, but the MVP should remain simple and inexpensive.

--------------------------------------------------
## 2. PRODUCT GOAL
--------------------------------------------------

The system should replace the library owner's manual process for:

1. Admission
2. Seat allocation
3. Fee collection
4. Due tracking
5. Attendance
6. Membership renewal
7. Student communication
8. Internet access management

The most important differentiator is managed library Wi-Fi.

The software should eventually allow:

Student
    ↓
Connect to library Wi-Fi
    ↓
Captive portal
    ↓
Student authentication
    ↓
Check membership
    ↓
Check shift
    ↓
Check payment status
    ↓
Check device authorization
    ↓
Internet access

--------------------------------------------------
## 3. TARGET USERS
--------------------------------------------------

There are five initial roles:

OWNER
MANAGER
RECEPTIONIST
ACCOUNTANT
STUDENT

### OWNER

Full library access.

Can:

- manage library
- manage staff
- manage students
- manage seats
- manage plans
- manage payments
- manage concessions
- manage attendance
- manage internet
- manage guests
- configure settings
- view reports
- view audit logs
- configure notifications

### MANAGER

Operational management.

### RECEPTIONIST

Daily library operations:

- add student
- assign seat
- move seat
- attendance
- collect payments if permitted
- view student information

### ACCOUNTANT

Financial operations:

- payments
- dues
- concessions
- receipts
- cash closing
- financial reports

### STUDENT

Student portal:

- profile
- membership
- seat
- shift
- payment status
- due amount
- Internet status
- registered devices
- requests/help

Authorization must be enforced on the backend.

Frontend hiding is NOT security.

--------------------------------------------------
## 4. TECHNOLOGY STACK
--------------------------------------------------

Use:

Frontend:
- Next.js
- React
- TypeScript
- mobile-first PWA

Backend:
- NestJS
- TypeScript
- REST API

Database:
- PostgreSQL

ORM:
- Prisma

Validation:
- NestJS DTO validation
- class-validator/class-transformer where appropriate

Authentication:
- secure server-side sessions
- HttpOnly cookies
- Secure cookies in production
- SameSite protection

Infrastructure:
- Docker
- Linux VPS
- Cloudflare

Router:
- OpenWrt
- openNDS
- custom Library Wi-Fi Agent

Notifications:
- SMS
- WhatsApp

Payments:
- Cash
- UPI

Do not introduce unnecessary infrastructure.

DO NOT use initially:

- Kubernetes
- microservices
- Kafka
- RabbitMQ
- Redis
- Elasticsearch
- separate analytics database

Use a modular monolith.

--------------------------------------------------
## 5. REPOSITORY STRUCTURE
--------------------------------------------------

Use:

library-saas/

apps/
    web/
        Next.js PWA

    api/
        NestJS API

packages/
    database/
    types/
    validation/
    config/

prisma/
    schema.prisma
    seed.ts

docs/

docker-compose.yml

.env.example

README.md

The structure can evolve if there is a documented reason.

--------------------------------------------------
## 6. MULTI-TENANCY
--------------------------------------------------

The system must be multi-tenant from the beginning.

Conceptual structure:

Organization
    ↓
Library
    ↓
Students
Seats
Admissions
Payments
Attendance
Routers
Staff

Every library-owned business record must contain a library relationship either directly or through a strongly controlled parent relation.

NEVER trust libraryId supplied by the frontend.

The authenticated user's library context determines access.

Library A must never be able to access Library B data.

All service methods must enforce tenant isolation.

--------------------------------------------------
## 7. INITIAL LIBRARY
--------------------------------------------------

Seed one library.

Example:

ABC Library

Initial capacity:

80 seats

Blocks:

Block A
A01–A40

Block B
B01–B40

Do not hard-code gender restrictions.

Blocks, sections and seat naming must be configurable.

--------------------------------------------------
## 8. SHIFTS
--------------------------------------------------

Shifts must be configurable.

Example initial shifts:

Morning:
06:30–12:00

Evening:
12:00–18:00

Full Day:
06:30–18:00

However, the software must NOT assume these times permanently.

Use minutes-from-midnight or another reliable representation instead of storing business logic as arbitrary strings.

Each shift should support:

- name
- start time
- end time
- grace before
- grace after
- active/inactive

--------------------------------------------------
## 9. MEMBERSHIP / ADMISSION
--------------------------------------------------

Student and Admission must be separate concepts.

A Student represents the person.

An Admission represents a membership period.

A student may have multiple admissions over time.

Admission should contain:

- student
- library
- plan
- shift
- start date
- end date
- status
- seat assignment relationship

Possible status:

ACTIVE
EXPIRED
SUSPENDED
CANCELLED
COMPLETED

Do not delete historical admissions.

--------------------------------------------------
## 10. SEAT MANAGEMENT
--------------------------------------------------

Seats must maintain history.

DO NOT simply store:

student.seatId

as the only source of truth.

Use:

SeatAssignment

with:

- student
- admission
- seat
- start time
- end time
- assigned by
- reason

This allows:

- seat changes
- retention
- release
- history
- audit

Business rule:

A seat cannot have two active assignments simultaneously.

A student cannot have two active seat assignments simultaneously unless explicitly supported later.

Use database constraints/transactions where practical.

--------------------------------------------------
## 11. FEES AND FINANCE
--------------------------------------------------

The financial system must be ledger-based.

Support:

- fee plans
- fee cycles
- charges
- payments
- concessions
- refunds
- adjustments
- reversals
- outstanding balance

Currency:

INR

Use PostgreSQL Decimal.

Never use floating-point numbers for money.

Financial records must never be hard deleted.

--------------------------------------------------
## 12. FEE CYCLES
--------------------------------------------------

Each membership billing period can have a FeeCycle.

Example:

August 2026
September 2026
October 2026

A FeeCycle contains:

- admission
- period start
- period end
- due date
- charge amount
- status

Possible status:

OPEN
PARTIAL
PAID
OVERDUE
VOID

Outstanding amount must be calculated reliably.

--------------------------------------------------
## 13. PAYMENTS
--------------------------------------------------

Payment methods:

CASH
UPI

Payment should contain:

- student
- admission
- amount
- method
- reference
- paidAt
- recordedBy
- status

Payment must be transactional.

UPI reference should be stored when available.

Cash payments contribute to daily cash closing.

--------------------------------------------------
## 14. PAYMENT ALLOCATION
--------------------------------------------------

A payment may cover:

- current fee
- previous due
- multiple fee cycles

Use PaymentAllocation rather than assuming one payment equals one month.

Default allocation strategy:

oldest outstanding fee first

unless the owner explicitly chooses another allocation.

--------------------------------------------------
## 15. CONCESSIONS
--------------------------------------------------

Concessions must be explicit.

Example:

Normal fee:
₹550

Concession:
₹50

Payable:
₹500

Store:

- amount
- reason
- fee cycle
- admission
- created by
- timestamp

Never modify the original fee silently.

--------------------------------------------------
## 16. RECEIPTS
--------------------------------------------------

Every successful payment should be capable of generating a receipt.

Receipt:

- receipt number
- payment
- student
- amount
- payment method
- date
- library
- recorded by

Receipt numbers must be unique within the library.

Support future sharing through WhatsApp.

--------------------------------------------------
## 17. DAILY CASH CLOSING
--------------------------------------------------

Provide daily cash reconciliation.

Example:

Opening cash
+
Cash collected
-
Cash refunds
=
Expected cash

Compare with:

Actual cash

Store:

- date
- opening cash
- expected cash
- actual cash
- difference
- closed by
- closed at

Do not modify historical closing records without an auditable correction process.

--------------------------------------------------
## 18. ATTENDANCE
--------------------------------------------------

Attendance should record:

- student
- library
- date
- check-in
- check-out
- status

Possible status:

PRESENT
ABSENT
LATE
LEAVE

Business date must use the library timezone.

Avoid duplicate attendance records for the same student/date unless explicitly supporting multiple sessions.

--------------------------------------------------
## 19. STUDENT HISTORY
--------------------------------------------------

Student timeline should show important events:

- admission
- seat assignment
- seat change
- payment
- concession
- attendance
- membership expiry
- renewal
- device registration
- Internet block/unblock
- requests

Do not create a separate history table for everything if the information can be safely derived from domain tables and audit logs.

Use explicit history tables where business history requires them.

--------------------------------------------------
## 20. STUDENT PORTAL
--------------------------------------------------

Mobile-first.

Student should see:

Welcome

Name

Student ID

Seat

Shift

Membership status

Membership expiry

Amount due

Internet status

Registered devices

Requests/help

Example:

Welcome Rahul

Seat:
A12

Shift:
08:00 AM – 02:00 PM

Membership:
Active until 10 Oct

Payment:
₹0 due

Internet:
Active

Devices:
Phone
Laptop

--------------------------------------------------
## 21. STUDENT AUTHENTICATION
--------------------------------------------------

Initial student authentication:

Student ID/mobile
    ↓
SMS OTP
    ↓
Verify OTP
    ↓
Register device
    ↓
Create secure session

OTP requirements:

- single-use
- short expiry
- rate limited
- attempt limited
- never store plaintext OTP
- never log OTP
- do not expose OTP through API responses

OTP may be required again for:

- new device
- device replacement
- revoked device
- account recovery
- mobile number change
- suspicious access

Do not require daily OTP for recognized devices.

--------------------------------------------------
## 22. SESSION SECURITY
--------------------------------------------------

Do not store authentication tokens in:

localStorage
sessionStorage

Use secure HttpOnly cookies.

Server-side sessions should contain:

- session ID/token hash
- user/student
- library
- device where appropriate
- createdAt
- expiresAt
- lastSeenAt
- revokedAt

Session secrets must never be exposed to frontend JavaScript.

--------------------------------------------------
## 23. DEVICE MANAGEMENT
--------------------------------------------------

Default:

1 phone
1 laptop

Admin can grant additional devices.

Device record:

- student
- type
- name
- credential hash
- status
- registeredAt
- lastSeenAt
- revokedAt

Device status:

ACTIVE
BLOCKED
REVOKED

Do not treat IP or MAC address as a trusted identity.

MAC/IP are network correlation data.

Private/randomized MAC addresses must be considered.

--------------------------------------------------
## 24. INTERNET ACCESS ENGINE
--------------------------------------------------

Internet access is NOT simply:

student.internetEnabled = true

Instead calculate:

membership
+
shift
+
current time
+
payment status
+
device authorization
+
device limit
+
admin override
+
guest authorization

Example:

ACTIVE MEMBERSHIP
    ↓
CURRENT SHIFT
    ↓
PAYMENT ALLOWED
    ↓
AUTHORIZED DEVICE
    ↓
ALLOW INTERNET

Otherwise:

DENY

The access decision should be implemented in a dedicated service.

Example:

InternetAccessService

Methods may include:

checkAccess()
grantAccess()
revokeAccess()
disconnectDevice()
blockDevice()
unblockDevice()
getAccessStatus()

--------------------------------------------------
## 25. INTERNET DUE POLICY
--------------------------------------------------

Default:

After fee becomes overdue:

Day 1:
Reminder

Day 2:
Reminder

Day 3:
Warning

Day 4:
Internet blocked

Payment:
    ↓
Payment recorded
    ↓
Access recalculated
    ↓
Internet restored

This policy must be configurable.

Do not hard-code 3 days.

--------------------------------------------------
## 26. INTERNET SESSION LOGGING
--------------------------------------------------

Store operational network information required for access control and security.

Possible fields:

- library
- student
- device
- router
- start
- end
- client IP
- client MAC
- status
- authorization reason

Do NOT routinely collect:

- browsing history
- URLs visited
- DNS history
- page content
- downloads

unless a future lawful requirement specifically requires such processing.

--------------------------------------------------
## 27. GUEST INTERNET
--------------------------------------------------

Only admin-authorized staff can create guests.

Guest:

- name
- mobile
- purpose
- access start
- access expiry
- device limit
- status

Support:

- create
- extend
- disconnect
- block
- expire

Guest access must never bypass the router's security model.

--------------------------------------------------
## 28. ROUTER
--------------------------------------------------

Initial router:

Airtel AAP4221ZY

Already running OpenWrt.

Do NOT implement firmware flashing through the SaaS.

The router communicates with the cloud through an outbound secure connection.

Avoid exposing router administration directly to the Internet.

--------------------------------------------------
## 29. ROUTER ENROLLMENT
--------------------------------------------------

Owner flow:

Add Router
    ↓
Generate QR
    ↓
Scan QR from router setup
    ↓
One-time enrollment
    ↓
Router registered
    ↓
Agent connects
    ↓
Health check
    ↓
Captive portal configuration
    ↓
Ready

Enrollment token:

- random
- short-lived
- one-time
- stored hashed
- invalid after use
- never contains permanent credentials

Example expiration:

15 minutes

--------------------------------------------------
## 30. ROUTER AGENT
--------------------------------------------------

The router agent communicates with the NestJS backend.

The cloud must NEVER expose arbitrary shell commands.

Only allowlisted operations.

Examples:

HEALTH_CHECK
GET_STATUS
CONFIGURE_CAPTIVE_PORTAL
UPDATE_CONFIG
DISCONNECT_USER
BLOCK_CLIENT
UNBLOCK_CLIENT
RESTART_OPENNDS

Every command must be:

- authenticated
- authorized
- logged
- auditable

--------------------------------------------------
## 31. OPENNDS
--------------------------------------------------

Use openNDS for captive portal functionality.

The exact configuration must match the installed OpenNDS version.

Do not assume configuration syntax from an older version.

The agent should manage configuration safely.

Do not expose raw OpenNDS configuration to normal library owners.

The owner should see:

Internet
Connected
42 students online

not:

iptables
nftables
FAS
VLAN
gateway interface
etc.

--------------------------------------------------
## 32. LIBRARY HEALTH
--------------------------------------------------

Create a Library Health score.

Initial weighting:

Seat utilization:
25%

Payment health:
25%

Membership health:
20%

Attendance:
15%

Internet health:
15%

Score bands:

90–100:
Excellent

75–89:
Healthy

60–74:
Needs Attention

40–59:
At Risk

0–39:
Critical

IMPORTANT:

Never show only the score.

Always show:

- score
- contributing factors
- reasons
- suggested operational actions

Example:

Health: 72

Reasons:

3 memberships expiring
₹4,850 overdue
attendance decreased

Actions:

Review expiring memberships
Contact overdue students

The score is an operational metric, not a scientific measurement.

--------------------------------------------------
## 33. DASHBOARD
--------------------------------------------------

Owner dashboard should show:

Library Health

Seats:
63 / 80

Occupancy:
79%

Today's collection:
₹8,450

Outstanding dues:
₹XX

Attendance:
XX / 80

Internet:
XX online

Attention:

- memberships expiring
- overdue payments
- prolonged absence
- Internet problems
- vacant seats

Quick actions:

+ New Student

Seats

Money

Attendance

Internet

Health

--------------------------------------------------
## 34. SMART ALERTS
--------------------------------------------------

Initial alerts:

Membership expiring soon

Fee due

Fee overdue

Seat vacancy

Prolonged absence

Internet issue

Device blocked

Router offline

Notifications must be configurable.

--------------------------------------------------
## 35. NOTIFICATIONS
--------------------------------------------------

Channels:

SMS
WhatsApp

Architecture:

EVENT
    ↓
Notification Rule
    ↓
Template
    ↓
Channel
    ↓
Provider
    ↓
Delivery status

Store:

- channel
- recipient
- template
- message metadata
- provider ID
- status
- attempts
- sentAt
- failure reason

Do not send promotional messages through transactional infrastructure without appropriate compliance handling.

--------------------------------------------------
## 36. SEARCH
--------------------------------------------------

Provide global search.

Search:

- student name
- student ID
- mobile
- seat

Example:

Search:
Rahul

Result:

Rahul Sharma
A12
08:00–14:00
₹550 due
Internet Active

Quick actions:

Call
Payment
Seat
Internet
History

--------------------------------------------------
## 37. AUDIT LOG
--------------------------------------------------

Sensitive actions must be audited.

Audit record should contain:

- actor
- actor type
- library
- action
- entity type
- entity ID
- timestamp
- result
- IP where appropriate
- user agent where appropriate
- metadata

Examples:

STUDENT_CREATED
SEAT_ASSIGNED
SEAT_MOVED
PAYMENT_RECORDED
CONCESSION_CREATED
MEMBERSHIP_RENEWED
DEVICE_REGISTERED
DEVICE_REVOKED
INTERNET_BLOCKED
INTERNET_RESTORED
ROUTER_ENROLLED
STAFF_CREATED
SETTINGS_CHANGED

Never allow normal users to delete audit records.

--------------------------------------------------
## 38. SECURITY
--------------------------------------------------

Implement defense in depth.

Required:

- HTTPS
- secure cookies
- input validation
- authentication
- RBAC
- tenant isolation
- rate limiting
- OTP rate limiting
- password hashing
- admin re-authentication for sensitive operations
- audit logging
- secure secrets
- private database
- backups
- router isolation
- outbound router agent
- allowlisted router commands

Never:

- expose DB credentials
- expose OTP
- expose password hashes
- put secrets in frontend
- use frontend authorization as the security boundary
- execute arbitrary shell commands from API input
- trust client-provided libraryId
- store authentication tokens in localStorage

--------------------------------------------------
## 39. DATABASE DESIGN
--------------------------------------------------

Expected core entities:

Organization
Library
LibrarySetting

User

Student
StudentDevice
AuthSession
OtpChallenge

Block
Section
Seat
SeatAssignment

Shift
Plan
Admission

FeeCycle
FeeLedgerEntry
Payment
PaymentAllocation
Concession
Receipt
CashClosing

Attendance

Router
RouterEnrollmentToken
RouterCommand
RouterEvent

InternetSession

GuestUser
GuestSession

Notification

StudentRequest

AuditLog

Additional tables may be introduced only when justified.

--------------------------------------------------
## 40. DATABASE CONVENTIONS
--------------------------------------------------

Internal IDs:

UUID

Student IDs:

human-readable code such as:

LIB001

Money:

Decimal(12,2)

Timestamps:

UTC

Business date:

library timezone

Financial records:

immutable

Soft deletion:

prefer status/inactive fields.

Use foreign keys.

Use appropriate unique constraints.

Use transactions for:

- admission
- seat assignment
- payment
- concession
- renewal
- device registration
- Internet state changes where required

--------------------------------------------------
## 41. API ARCHITECTURE
--------------------------------------------------

Base:

/api/v1

Modules:

/auth
/users
/libraries
/students
/admissions
/shifts
/plans
/blocks
/sections
/seats
/payments
/fees
/concessions
/receipts
/attendance
/internet
/devices
/sessions
/guests
/routers
/router-enrollment
/notifications
/requests
/dashboard
/health
/audit
/settings

Every protected request:

Authentication
    ↓
Tenant Context
    ↓
Authorization
    ↓
Resource Ownership
    ↓
Business Rules
    ↓
Database

--------------------------------------------------
## 42. FRONTEND STRUCTURE
--------------------------------------------------

Mobile-first.

Owner navigation:

Dashboard
Students
Seats
Money
Attendance
Internet
Reports
Settings

Student navigation:

Home
Membership
Seat
Internet
Payments
Devices
Help

Use reusable components.

Do not put business logic into React components if it belongs in the backend.

--------------------------------------------------
## 43. PWA
--------------------------------------------------

The application should behave like a mobile application.

Requirements:

- responsive
- installable
- manifest
- app icon
- service worker where appropriate
- mobile-first layout

Students should not be required to install a native application.

No Android/iOS native application in Phase 1.

--------------------------------------------------
## 44. PERFORMANCE
--------------------------------------------------

Initial deployment:

One small VPS.

Avoid premature optimization.

Use PostgreSQL indexes for:

- libraryId
- studentCode
- mobile
- seat
- admission status
- fee due date
- attendance date
- router status

Use pagination for large lists.

Avoid N+1 queries.

--------------------------------------------------
## 45. ERROR HANDLING
--------------------------------------------------

API errors must be structured.

Never expose stack traces or internal database errors to normal users.

Log internal errors securely.

Frontend should display human-readable messages.

--------------------------------------------------
## 46. LOGGING
--------------------------------------------------

Separate:

Application logs
Audit logs
Router events
Notification delivery logs
Internet session records

Do not put secrets or OTPs in logs.

--------------------------------------------------
## 47. BACKUPS
--------------------------------------------------

Production PostgreSQL must have automated backups.

The application must not depend on a developer's laptop for data recovery.

Document:

- backup
- restore
- retention
- recovery procedure

--------------------------------------------------
## 48. TESTING
--------------------------------------------------

Important business rules must have automated tests.

Minimum tests:

Student creation

Duplicate student validation

Seat assignment

Seat conflict

Seat movement

Admission activation

Fee calculation

Concession

Payment

Payment allocation

Outstanding balance

Attendance

Internet access decision

Device limit

Overdue Internet restriction

Admin override

Tenant isolation

RBAC

Router command authorization

--------------------------------------------------
## 49. DEVELOPMENT PHASES
--------------------------------------------------

PHASE 1A — FOUNDATION

- repository
- workspaces
- Next.js
- NestJS
- PostgreSQL
- Prisma
- environment configuration
- logging
- basic authentication
- base UI

PHASE 1B — LIBRARY

- library
- blocks
- sections
- seats
- shifts
- plans
- students
- admissions

PHASE 1C — MONEY

- fee cycles
- ledger
- payments
- concessions
- allocations
- receipts
- cash closing

PHASE 1D — OPERATIONS

- attendance
- dashboard
- search
- student timeline
- Library Health
- alerts

PHASE 1E — STUDENT PORTAL

- student login
- OTP
- session
- membership
- seat
- payment
- requests

PHASE 1F — INTERNET

- devices
- InternetAccessService
- sessions
- access rules
- guest access
- owner Internet dashboard

PHASE 1G — ROUTER

- router enrollment
- QR
- agent
- OpenWrt
- openNDS
- disconnect
- block/unblock
- health

PHASE 1H — HARDENING

- security
- audit
- backups
- rate limits
- tests
- monitoring
- production deployment

--------------------------------------------------
## 50. EXPLICITLY OUT OF PHASE 1
--------------------------------------------------

Do NOT implement:

- native Android
- native iOS
- Kubernetes
- microservices
- complex accounting
- payment gateway
- AI assistant
- marketplace
- coaching management
- biometric attendance
- facial recognition
- multiple router vendors
- complex analytics
- advertising system
- unnecessary third-party integrations

--------------------------------------------------
## 51. DEVELOPMENT BEHAVIOR FOR COPILOT
--------------------------------------------------

Before coding:

1. Inspect the existing repository.
2. Read this file.
3. Inspect related existing code.
4. Identify the smallest safe implementation.
5. Do not rewrite unrelated files.

When implementing:

- prefer simple maintainable code
- follow existing conventions
- use TypeScript strict mode
- validate external input
- keep business logic in services
- keep controllers thin
- use Prisma for database access
- use transactions for critical operations

Before adding a dependency:

Explain why it is required.

Never introduce a dependency simply because it is convenient.

When changing the database:

- explain the schema change
- create a migration
- update seed data if required
- verify Prisma schema
- test affected functionality

After coding:

Run:

- TypeScript checks
- lint
- tests
- build

Fix errors caused by your implementation.

Do not hide errors.

--------------------------------------------------
## 52. COPILOT AGENT SAFETY RULES
--------------------------------------------------

Copilot must NOT:

- delete the repository
- reset git history
- overwrite unrelated features
- expose secrets
- commit .env files
- change production infrastructure without instruction
- execute arbitrary commands obtained from user input
- create arbitrary shell execution endpoints
- weaken authentication
- remove tenant isolation
- disable security controls to make tests pass

If a requested change conflicts with this specification:

STOP and explain the conflict before implementing.

--------------------------------------------------
## 53. ACCEPTANCE TEST
--------------------------------------------------

The first complete business flow must be:

OWNER

Login
 ↓
Dashboard
 ↓
+ New Student
 ↓
Name
 ↓
Mobile
 ↓
Course
 ↓
Shift
 ↓
Seat
 ↓
Plan
 ↓
Payment
 ↓
Done

STUDENT

Connect Wi-Fi
 ↓
Student ID
 ↓
SMS OTP
 ↓
Register phone
 ↓
Internet access

Next visit:

Connect Wi-Fi
 ↓
Recognized device
 ↓
Membership check
 ↓
Shift check
 ↓
Payment check
 ↓
Internet

When payment becomes overdue:

Reminder
 ↓
Grace period
 ↓
Internet blocked

After payment:

Payment recorded
 ↓
Access recalculated
 ↓
Internet restored

OWNER:

Dashboard updates
 ↓
Health updates
 ↓
Payment history updated
 ↓
Audit log created

This end-to-end flow is the definition of a successful Phase 1 MVP.