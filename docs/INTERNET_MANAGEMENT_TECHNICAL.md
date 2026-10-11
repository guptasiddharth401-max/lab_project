# Library SaaS - Internet Access Management Architecture

This document explains how the Library SaaS platform manages student internet access using a standard router with OpenWrt and how the system integrates business rules with network control.

---

## 1. Overview

Internet management in Library SaaS is **not just a yes/no toggle** stored in a database.

Instead, it is a **decision engine** that checks multiple business and operational factors in real-time:

```
Student connects to Wi-Fi
        ↓
Router redirects to Captive Portal
        ↓
Student enters credentials
        ↓
SaaS Backend checks:
    - Is membership active?
    - Is current shift valid?
    - Is payment status clear?
    - Is device authorized?
    - Is there admin block?
        ↓
Decision: ALLOW or DENY
        ↓
Router applies decision (permit or block MAC/IP)
        ↓
Student can use internet OR sees error message
```

---

## 2. Hardware: Normal Router (OpenWrt)

### Supported Router

The system uses:

- **Router**: Airtel AAP4221ZY (or similar with OpenWrt)
- **Firmware**: OpenWrt (open-source Linux router firmware)
- **Portal Engine**: openNDS (open Network Daemon for captive portals)
- **Communication**: Secure outbound HTTPS to SaaS cloud

### Why OpenWrt + openNDS?

1. **Low cost**: No special hardware required
2. **Flexible**: Can be configured for your exact rules
3. **Secure**: Open-source, community audited
4. **Scalable**: Handles many concurrent connections
5. **Standard**: Works with any ISP connection

### Router Network Setup

```
ISP Internet
    ↓
Router (OpenWrt)
    ├── WAN Port (ISP connection)
    ├── LAN Ports (library devices)
    ├── Wi-Fi SSID: "Library-WiFi"
    └── Captive Portal (openNDS)
         └── Redirects to SaaS login
```

---

## 3. How Captive Portal Works

### Normal Wi-Fi Connection Flow (without Captive Portal)

```
Student connects to Wi-Fi
    ↓
Router assigns IP
    ↓
Student opens browser
    ↓
Any URL works immediately
```

### With Captive Portal (Library SaaS)

```
Student connects to Wi-Fi
    ↓
Router detects new device
    ↓
Router intercepts all HTTP requests
    ↓
Redirects to: https://library.local/login
    ↓
Student sees login page
    ↓
Student enters:
    - Student ID or email
    - Password or OTP
    ↓
Backend validates (membership, payment, device)
    ↓
If ALLOW: Router releases the device
         - Student can now browse freely
         - Session tracked in database
    ↓
If DENY: Router keeps blocking
         - Student sees error message
         - Reason displayed (e.g., "Payment due")
```

---

## 4. Business Rule Engine

The **InternetAccessService** in the NestJS backend implements the decision logic:

```typescript
async checkAccess(studentId, deviceId, libraryId) {
  
  // 1. Student exists and is active?
  const student = await db.student.findFirst({ ... });
  if (!student || !student.active) return DENY;
  
  // 2. Membership is valid (admission active)?
  const admission = await db.admission.findFirst({
    where: { studentId, status: 'ACTIVE', endDate >= now() }
  });
  if (!admission) return DENY;
  
  // 3. Is it the right shift (time)?
  const shift = admission.shift;
  if (currentTime < shift.startTime || currentTime > shift.endTime) {
    return DENY;
  }
  
  // 4. Payment status is clear?
  const outstanding = await getOutstandingBalance(studentId);
  if (outstanding > 0) {
    const days = daysOverdue(admission);
    if (days > BLOCK_THRESHOLD) {  // e.g., 4 days
      return DENY;  // Block due to payment
    }
  }
  
  // 5. Device is registered and not revoked?
  const device = await db.studentDevice.findFirst({
    where: { studentId, id: deviceId, status: 'ACTIVE' }
  });
  if (!device) return DENY;
  
  // 6. Admin override (e.g., explicitly blocked)?
  const block = await db.internetBlock.findFirst({
    where: { studentId, active: true }
  });
  if (block) return DENY;
  
  // All checks passed
  return ALLOW;
}
```

**Result**: A real-time decision based on current state.

---

## 5. Integration: SaaS ↔ Router

### Communication Flow

```
1. Student tries to access internet on Wi-Fi
        ↓
2. openNDS captive portal intercepts
        ↓
3. Student submits login (student ID + password)
        ↓
4. openNDS sends request to SaaS backend:
   POST /api/v1/internet/authenticate
   {
     "studentId": "LIB-2024-001",
     "password": "...",
     "deviceMAC": "aa:bb:cc:dd:ee:ff",
     "libraryId": "lib-1"
   }
        ↓
5. SaaS Backend runs checkAccess()
        ↓
6. Backend responds with:
   {
     "allowed": true,
     "sessionId": "sess-xyz",
     "reason": "Valid membership + payment OK"
   }
   OR
   {
     "allowed": false,
     "reason": "Payment outstanding (4 days overdue)"
   }
        ↓
7. openNDS reads response
        ↓
8. If ALLOW:
   - Router whitelists device MAC/IP
   - Device can browse freely
   - Session logged in database
   OR
9. If DENY:
   - Router keeps blocking device
   - Student sees error page with reason
```

### Real Example Message Flow

**Student**: "Rahul Sharma"
- Student ID: LIB-2024-001
- Membership: Active (until Oct 31)
- Shift: 2 PM - 8 PM
- Outstanding balance: ₹1,500 (5 days overdue)
- Block threshold: 4 days

**Current time**: 6:00 PM (within shift)

**Router captive portal login**:
```
Student enters: LIB-2024-001 / password
Device MAC: aa:11:22:33:44:55

Router → SaaS Backend:
POST /api/internet/authenticate
{
  "studentId": "LIB-2024-001",
  "password": "...",
  "deviceMAC": "aa:11:22:33:44:55",
  "libraryId": "lib-1"
}

Backend checks:
1. ✓ Student exists and active
2. ✓ Admission is ACTIVE, ends Oct 31
3. ✓ Current time (6 PM) is within shift (2-8 PM)
4. ✗ Outstanding: ₹1,500, overdue 5 days (> 4-day threshold)

Result: DENY (payment overdue)

SaaS → Router:
{
  "allowed": false,
  "reason": "Payment overdue by 5 days. Please pay ₹1,500 at desk."
}

Router:
→ Keeps device blocked
→ Shows error page to student

Student sees:
"Access Denied: Your membership fees are overdue.
Please contact the library desk for payment options."
```

**Next scenario**: Student pays ₹1,500 at desk.

Receptionist records payment in SaaS dashboard:
```
Payments → Record Payment
Student: Rahul Sharma
Amount: ₹1,500
Method: Cash
```

Backend updates balance immediately.

**Student tries to connect again**:

```
Router → SaaS Backend:
POST /api/internet/authenticate
{
  "studentId": "LIB-2024-001",
  ...
}

Backend checks:
1. ✓ Student exists and active
2. ✓ Admission is ACTIVE
3. ✓ Within shift
4. ✓ Outstanding: ₹0 (just paid)
5. ✓ Device is authorized
6. ✓ No admin block

Result: ALLOW

SaaS → Router:
{
  "allowed": true,
  "sessionId": "sess-abc123",
  "message": "Welcome Rahul! Enjoy your session."
}

Router:
→ Whitelists device MAC/IP
→ Allows all traffic
→ Logs session start

Student: Can now browse freely!
```

---

## 6. Session Management

Once allowed, a session is created:

```typescript
// Database record
InternetSession {
  id: 'sess-abc123',
  studentId: 'LIB-2024-001',
  libraryId: 'lib-1',
  deviceMAC: 'aa:11:22:33:44:55',
  routerId: 'router-1',
  
  // Timing
  startedAt: 2026-10-11T18:05:00Z,
  endedAt: null,  // Until they log out or disconnect
  
  // Status
  status: 'ACTIVE',  // or BLOCKED, EXPIRED
  
  // Metrics
  dataDownloaded: 2.5,  // GB
  dataUploaded: 0.3,    // GB
  
  // Authorization
  authorizationReason: 'Valid membership + payment OK',
  
  // Audit
  createdAt: 2026-10-11T18:05:00Z,
}
```

---

## 7. Admin Controls in SaaS Dashboard

### Block a Student

Library staff can manually block internet access:

```
Internet Access → Find Student → Block Access

Reason: "Non-payment enforcement"

Backend:
1. Records block in database
2. Instructs router to revoke any active sessions
3. Adds rule to deny future login attempts
```

Router immediately disconnects active session.

### Unblock a Student

```
Internet Access → Find Student → Unblock Access

Backend:
1. Removes block record
2. Clears any active denials
3. Next login attempt will re-check all rules

Student can connect on next attempt.
```

---

## 8. Device Registration and Limits

Each student has a **device limit** (default: 1 phone + 1 laptop).

### First-Time Device Connection

```
Student connects on new laptop
    ↓
Portal redirects to login
    ↓
Student logs in
    ↓
Backend recognizes new device
    ↓
If within device limit:
  → Device auto-registered
  → Access ALLOWED
Else (over limit):
  → Backend returns error: "You have 2 devices registered. 
                           Remove one from settings."
  → Device DENIED
```

### Managing Devices

Student can see in **Student Portal**:

- Phone (registered Oct 1, active)
- Laptop (registered Oct 5, active)
- Can request to add more via staff

---

## 9. Shift-Based Access

Different shifts can have different access rules.

```
Morning Shift (6:30 AM - 12:00 PM):
  → Can access internet during shift hours
  
Evening Shift (12:00 PM - 6:00 PM):
  → Can access internet during shift hours

Full Day (6:30 AM - 6:00 PM):
  → Can access internet during entire window

Off-shift attempt:
  Student tries to connect at 7:00 PM (evening shift, outside window)
      ↓
  Backend checks time against shift
      ↓
  checkAccess() returns DENY (outside operating hours)
      ↓
  Student sees: "Your shift ends at 6 PM. Try again tomorrow."
```

---

## 10. Internet Due Policy (Configurable)

Default policy:

| Days Overdue | Action |
|---|---|
| 0-1 | Reminder (SMS/email) |
| 2-3 | Warning (dashboard alert) |
| 4+ | Internet BLOCKED |

This is **configurable** per library:

```
Admin Settings → Internet Policy

Block threshold: [ 4 ] days
Remind after: [ 1 ] day
Grace period: [ 0 ] days
```

When payment is made, block is immediately lifted.

---

## 11. Router Agent Architecture

The router runs a lightweight **agent** that:

1. **Authenticates** with SaaS backend (secure connection)
2. **Pulls configuration** (rules, policy, blocklists)
3. **Reports status** (uptime, connected devices, metrics)
4. **Executes commands** (block user, restart DNS, etc.)

```
┌─────────────────────────────────────┐
│  Library SaaS Backend (Cloud)       │
│  - User database                    │
│  - Business logic                   │
│  - Internet access rules            │
└────────────┬────────────────────────┘
             │ HTTPS (secure)
             │ Polling every 5 seconds
             │
┌────────────▼────────────────────────┐
│  Router (OpenWrt)                   │
│  ┌───────────────────────────────┐  │
│  │ Library SaaS Agent            │  │
│  │ - Authenticates with backend  │  │
│  │ - Pulls blocklists            │  │
│  │ - Reports device metrics      │  │
│  └────────┬──────────────────────┘  │
│           │                         │
│  ┌────────▼──────────────────────┐  │
│  │ openNDS (Captive Portal)      │  │
│  │ - Login page                  │  │
│  │ - Device redirect             │  │
│  │ - Session management          │  │
│  └────────┬──────────────────────┘  │
│           │                         │
│  ┌────────▼──────────────────────┐  │
│  │ Linux Kernel / Firewall       │  │
│  │ - MAC/IP whitelist            │  │
│  │ - Block rules                 │  │
│  │ - DHCP                        │  │
│  └───────────────────────────────┘  │
└────────────────────────────────────┘
             │
             │ Wi-Fi (2.4/5 GHz)
             │
        Student Devices
```

---

## 12. Security Measures

### Protections Against Abuse

1. **MAC spoofing**: Don't trust MAC alone; require re-auth
2. **IP spoofing**: Backend tracks session by StudentID, not IP
3. **Bypass attempts**: Every request is re-authorized
4. **Credential theft**: Passwords hashed; never sent unencrypted
5. **Session hijacking**: Sessions tied to StudentID + DeviceID

### Audit Trail

Every internet action is logged:

```
AuditLog {
  libraryId: "lib-1",
  actor: "system",
  action: "INTERNET_BLOCK",
  entity: "InternetSession",
  entityId: "sess-abc123",
  result: "SUCCESS",
  metadata: {
    studentId: "LIB-2024-001",
    reason: "Payment overdue 5 days",
    blockedAt: "2026-10-11T18:15:00Z"
  }
}
```

---

## 13. Operational Flow: End to End

### Morning Setup

1. Router boots → connects to SaaS backend
2. Backend sends policy and blocklist
3. openNDS starts accepting login attempts
4. Staff opens dashboard → "Internet: Healthy, 0 connected"

### During Day

```
9:00 AM: 5 students connected
10:00 AM: 12 students connected
12:00 PM: 28 students connected (peak)
2:00 PM: 18 students connected
5:00 PM: 8 students connected
```

All connections monitored in real-time in dashboard.

### Block Scenario

Accountant notices: Priya Singh has ₹2,500 overdue for 6 days.

**Action**: Go to Internet Access → Find Priya → Block Access

Backend immediately:
1. Records block in database
2. Sends revoke command to router
3. Router disconnects Priya's active session
4. Future login attempts return: "Your account is blocked. Contact desk."

**Later**: Priya pays ₹2,500.

Accountant: Internet Access → Find Priya → Unblock

Backend:
1. Removes block
2. Clears denial
3. Priya can reconnect immediately

---

## 14. Real-World Deployment Example

**Scenario**: 80-seat library, 60 active students

### Setup

- Router: Airtel AAP4221ZY (₹3,500)
- Agent: Pre-loaded on router SD card
- SaaS: Running on ₹200/month cloud server
- Database: PostgreSQL (included in cloud)

### Day 1 Metrics

```
Active students: 42
Concurrent sessions: 28
Peak concurrent: 35
Data usage: 2.3 GB/hour
Router uptime: 100%
Average session: 2.5 hours
Blocked students: 3 (overdue)
```

### Admin Dashboard View

```
┌─────────────────────────────────────┐
│ Internet Access Dashboard           │
├─────────────────────────────────────┤
│ Status: Online                      │
│ Connected: 28 students              │
│ Data today: 42.5 GB                 │
│ Router health: 98.2% uptime         │
│ Blocked devices: 3                  │
├─────────────────────────────────────┤
│ Recent Activity                     │
│ 6:05 PM - Rahul connected           │
│ 6:03 PM - Priya blocked (payment)   │
│ 6:00 PM - Amit unblocked            │
│ 5:58 PM - New device registered     │
└─────────────────────────────────────┘
```

---

## 15. Troubleshooting

### Student says: "I can't connect to Wi-Fi"

**Checks**:
1. Is router online? (check dashboard)
2. Is student's membership active? (check student profile)
3. Is payment current? (check outstanding balance)
4. Is student's device registered? (check device list)
5. Is student within their shift? (check current time vs. shift)
6. Is there a manual block? (check internet access page)

### Wi-Fi is slow

**Checks**:
1. How many concurrent sessions? (peak load?)
2. Total data usage bandwidth? (capped by ISP?)
3. Is router CPU high? (check router metrics)
4. Are there interference/RF issues? (move router)

### Router went offline

1. Check network cable (WAN port)
2. Check if ISP service is down
3. Restart router (Power off 30 sec, back on)
4. Check router logs for errors
5. Contact ISP if still offline after restart

---

## 16. Summary

Internet management in Library SaaS is:

✅ **Business-driven**: Access decisions based on membership, payment, shift
✅ **Real-time**: Changes (block, unblock, new payment) take effect immediately
✅ **Simple to operate**: Non-technical library staff can manage it
✅ **Secure**: Multi-factor authorization (membership + payment + device + shift)
✅ **Auditable**: Every action logged with timestamp, actor, reason
✅ **Hardware-agnostic**: Works with any OpenWrt-compatible router
✅ **Low-cost**: Standard router + open-source software
✅ **Scalable**: Handles hundreds of concurrent sessions

---

**Next**: Deploy on your router and monitor first week of live traffic.

For questions, refer to deployment runbook or contact support.
