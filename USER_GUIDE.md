# Library SaaS - User Guide

A complete guide to using the Library SaaS platform for managing student memberships, payments, internet access, and library operations.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Students](#managing-students)
5. [Recording Payments](#recording-payments)
6. [Managing Internet Access](#managing-internet-access)
7. [Monitoring Library Health](#monitoring-library-health)
8. [Role-Based Features](#role-based-features)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Stable internet connection
- JavaScript enabled
- Cookie support enabled

### First-Time Setup

1. **Access the platform**: Navigate to `http://localhost:3001` (development) or your production URL
2. **Sign in**: Use your library credentials
3. **Select your library**: If you manage multiple libraries, select the one you want to work with
4. **Explore the dashboard**: Familiarize yourself with the main sections

---

## Login & Authentication

### Signing In

1. Navigate to the **Sign in** page
2. Enter your registered email address
3. Enter your password
4. Click **"Enter dashboard"**

**Demo Credentials** (for testing):
```
Email: owner@library.com
Password: owner@123
```

### Session Management

- Sessions remain active for **24 hours** by default
- Activity timeout: **30 minutes** of inactivity will log you out
- You can manually log out using the profile menu

### Password Security

- Passwords must be at least **8 characters** long
- Include a mix of **uppercase, lowercase, numbers, and symbols**
- Change your password regularly (every 90 days recommended)
- Never share your password with colleagues

---

## Dashboard Overview

The **Dashboard** is your central hub for library operations.

### Key Sections

#### 1. Overview Cards
- **Active Students**: Total students with current memberships
- **Today's Revenue**: Cash and UPI payments collected today
- **Outstanding Fees**: Total pending payments from students
- **Internet Health**: Current Wi-Fi network status

#### 2. Student Roster Preview
Quick view of recent student activity:
- Student name and ID
- Membership status (Active/Warning/Due)
- Outstanding balance
- Click any student to view full profile

#### 3. Recent Payments
Latest transactions recorded:
- Payment ID and receipt number
- Student name and amount
- Payment method (Cash/UPI)
- Timestamp

#### 4. Alert Center
Real-time operational alerts:
- Overdue membership renewals
- Payment collection issues
- Network incidents
- Administrative tasks pending

#### 5. Library Health Score
Overall operational health:
- **90-100**: Excellent – Everything running smoothly
- **75-89**: Healthy – Monitor regularly
- **60-74**: Needs Attention – Take action soon
- **40-59**: At Risk – Schedule review meeting
- **Below 40**: Critical – Immediate action required

---

## Managing Students

### Adding a New Student

1. Navigate to **Students** section
2. Click **"+ Add student"** button
3. Fill in the form:
   - **Student Code**: Unique identifier (e.g., `LIB-2024-001`)
   - **Full Name**: Complete name
   - **Mobile Number**: 10-digit phone number
   - **Email**: Student's email address (optional)
   - **Course/Program**: Study field or course name
4. Click **"Create student record"**
5. A confirmation receipt will be displayed

### Viewing Student Profile

1. Go to **Students** section
2. Click on any student name to open their profile
3. View information:
   - Personal details
   - Membership history
   - Payment history
   - Internet usage
   - Outstanding fees
   - Attendance records

### Editing Student Information

1. Open student profile
2. Click **"Edit"** button
3. Update fields as needed
4. Click **"Save changes"**
5. Changes are effective immediately

### Activating/Deactivating Students

1. Open student profile
2. Look for **"Status"** section
3. Click **"Activate"** or **"Deactivate"**
4. Confirm the action
5. The student's access is updated instantly

---

## Recording Payments

### Manual Payment Entry

1. Navigate to **Payments** section
2. Click **"+ Record payment"** button
3. Fill in payment details:
   - **Student**: Select from dropdown (search by name or ID)
   - **Admission ID**: Auto-populated if student has active admission
   - **Amount**: Payment amount (in ₹)
   - **Payment Method**: 
     - **Cash**: Manual payment collection
     - **UPI**: Digital payment via UPI app
   - **Reference**: Transaction ID or receipt number
4. Click **"Record payment"**
5. A receipt is auto-generated with receipt number (e.g., `RCP-000042`)

### Payment Receipt

After recording a payment, you can:
- **View receipt**: Click the receipt number to open PDF
- **Print receipt**: Use browser print function (Ctrl+P)
- **Email receipt**: Click "Email to student"
- **Download receipt**: Click "Download as PDF"

### Refunding a Payment

1. Go to **Payments** section
2. Find the payment in the list
3. Click the payment ID to open details
4. Click **"Refund payment"** button
5. Enter refund amount and reason
6. Click **"Process refund"**
7. The refund is recorded and student balance is credited

### Viewing Outstanding Balances

1. Navigate to **Payments** section
2. View **"Outstanding"** card at top (total across library)
3. For individual student:
   - Go to **Students** → click student → view **"Outstanding balance"**
4. To view all students with pending fees:
   - Click **"View all outstanding"** link
   - Filter by amount range or date range

### Payment Allocation Rules

When a payment is recorded:
1. System identifies all overdue fees (oldest first)
2. Payment is automatically allocated to outstanding cycles
3. Once a fee cycle is fully paid, status changes to "PAID"
4. Partial payments update fee cycle status to "PARTIAL"
5. Any overpayment carries forward to next cycle

**Example**:
- Student has two outstanding cycles: ₹1,500 (overdue) + ₹1,000 (due)
- You record payment of ₹2,000
- System allocates: ₹1,500 to first cycle + ₹500 to second cycle
- Second cycle now shows ₹500 pending

---

## Managing Internet Access

### Viewing Active Sessions

1. Go to **Internet access** section
2. See **"Active sessions"** card showing current Wi-Fi users
3. View the session table with:
   - Session ID (unique per connection)
   - Student name
   - Connection status (Active/Warning/Blocked)
   - Data downloaded (GB)
   - Usage percentage

### Blocking Internet Access

1. Go to **Internet access** section
2. Find the student in session list
3. Click the session row → click **"Block access"**
4. Select reason:
   - Membership expired
   - Payment overdue
   - Policy violation
5. Click **"Confirm block"**
6. Access is blocked immediately; student sees error page

### Unblocking Access

1. Go to **Internet access** section
2. Filter by status: **"Blocked"**
3. Click on blocked session
4. Click **"Unblock access"**
5. Verify reason is resolved
6. Click **"Confirm unblock"**
7. Student can reconnect immediately

### Monitoring Bandwidth

1. In **Internet access** section, see **"Router health"** card
2. View per-student data usage:
   - Green: **< 25%** of quota
   - Yellow: **25-75%** of quota
   - Red: **> 75%** of quota
3. To set usage limits per student:
   - Click student session → **"Set data limit"**
   - Enter limit in GB (e.g., `10`)
   - Click **"Apply limit"**

### Router Management

1. Go to **Settings** → **"Internet configuration"**
2. View router status and logs
3. To restart router:
   - Click **"Router controls"**
   - Click **"Restart router"** (takes ~5 minutes)
   - Confirm action
4. View router temperature, uptime, and connected devices

---

## Monitoring Library Health

### Understanding Health Score

The **Library Health** page provides an overview of your library's operational status.

#### Health Factors (Each impacts score)

1. **Seat Utilization (25%)**: Percentage of seats occupied during operating hours
   - Target: 70-85% is optimal
   - Action: If < 50%, consider marketing initiatives

2. **Payment Health (25%)**: Percentage of fees collected on time
   - Target: > 85%
   - Action: If < 70%, implement collection campaign

3. **Membership Health (20%)**: Active members as % of total enrolled
   - Target: > 80%
   - Action: If < 60%, launch renewal drive

4. **Attendance Rate (15%)**: Daily attendance vs. active members
   - Target: 60-70% on school days
   - Action: If < 40%, investigate barriers

5. **Internet Health (15%)**: Network uptime and device performance
   - Target: 99.5% uptime
   - Action: If < 95%, contact IT support

### Viewing Detailed Metrics

1. Navigate to **Health** section
2. Each factor shows current value and status:
   - **Green (Healthy)**: No action needed
   - **Yellow (Watch)**: Monitor closely
   - **Red (Alert)**: Immediate action required

3. Click on any factor to see:
   - Trend graph (7-day view)
   - Contributing metrics
   - Recommended actions

### Alerts and Notifications

Alerts appear when health factors drop below thresholds:
- **Critical alerts** (red): Require action within 24 hours
- **High alerts** (orange): Require action within 7 days
- **Advisory alerts** (yellow): Monitor and plan action

To dismiss an alert:
1. Click the alert card
2. Confirm you've reviewed the issue
3. Click **"Dismiss alert"**
4. Alert is logged in audit trail

---

## Role-Based Features

### Owner Features
- Full access to all modules
- Financial reports and analytics
- User management and role assignment
- System settings and backups
- Library configuration
- Cannot be deleted (only deactivated)

### Manager Features
- Student and payment management
- Internet access control
- Health monitoring
- Limited financial reports
- Cannot access user management
- Cannot access system settings

### Receptionist Features
- Student registration and updates
- Payment recording
- Receipt issuance
- Cannot access health analytics
- Cannot modify internet settings
- Cannot access financial reports

### Accountant Features
- Payment recording and tracking
- Financial reports and reconciliation
- Outstanding balance tracking
- Cannot modify student records
- Cannot manage internet access
- Cannot access user settings

### Student Features
- View own profile
- View own payment history
- Check outstanding balance
- View own attendance
- Cannot modify any records
- View read-only dashboard

---

## Common Tasks

### Task 1: Enroll a New Student

**Scenario**: Rahul Sharma wants to join your library.

1. Go to **Students** → **"+ Add student"**
2. Fill form:
   - Code: `LIB-2024-101`
   - Name: `Rahul Sharma`
   - Mobile: `9876543210`
   - Email: `rahul@email.com`
   - Course: `B.Tech Computer Science`
3. Click **"Create student record"**
4. System creates record and sends confirmation to email
5. Assign admission plan (1-month, 3-month, or annual)
6. First fee cycle is auto-created
7. Student can access Wi-Fi immediately

### Task 2: Collect Monthly Fee

**Scenario**: Monthly payment collection from Priya Singh (₹1,500).

1. Go to **Payments** → **"+ Record payment"**
2. Select student: `Priya Singh`
3. Amount: `1500`
4. Method: `Cash`
5. Reference: Write down cash amount received
6. Click **"Record payment"**
7. Receipt `RCP-000042` is generated
8. Print and give receipt to student
9. Student's balance updates immediately
10. Payment appears in recent transactions

### Task 3: Block Student Due to Non-Payment

**Scenario**: Amit Kumar's payment is 30 days overdue.

1. Go to **Students**, find Amit Kumar
2. Click to open profile
3. View **"Outstanding balance"**: ₹2,500 overdue since 30 days
4. Click **"Actions"** → **"Block internet access"**
5. Reason: `Payment overdue`
6. Click **"Confirm block"**
7. Amit's sessions are blocked; he receives block notification
8. Internet access is denied until payment is made
9. Record payment when Amit pays
10. Re-enable access

### Task 4: Generate Payment Report

**Scenario**: You need today's cash collection report for owner.

1. Go to **Payments** section
2. See **"Cash today"** card at top: `₹4,260`
3. Click **"View details"**
4. Filter table: Date = Today, Method = Cash
5. All today's cash payments are listed
6. Click **"Export as PDF"** or **"Print"**
7. Report shows receipt numbers, amounts, and total

### Task 5: Investigate Low Health Score

**Scenario**: Library health score dropped from 85 to 72.

1. Go to **Health** section
2. Review factors:
   - Seat Utilization: 45% (alert – down from 60%)
   - Payment Health: 82% (OK)
   - Membership Health: 71% (watch)
   - Attendance Rate: 52% (OK)
   - Internet Health: 96% (good)
3. Click on **Seat Utilization** factor
4. View trend: Declining for 3 days
5. **Action**: 
   - Check if exams are happening (legitimate dip)
   - Review student feedback about facility
   - Plan marketing or facility improvement
6. Click **"Create action item"**
7. Assign to team member
8. Track completion in next review

---

## Troubleshooting

### Issue: Can't Log In

**Problem**: "Invalid credentials" message appears.

**Solutions**:
1. Verify email is spelled correctly
2. Ensure Caps Lock is OFF
3. Check password (if forgotten, contact owner)
4. Clear browser cookies and cache
5. Try a different browser
6. Check internet connection

### Issue: Payment Recorded But Balance Didn't Update

**Problem**: You recorded payment but student's balance shows same amount.

**Solutions**:
1. Refresh the page (F5 or Cmd+R)
2. Check if payment was actually recorded:
   - Go to **Payments** section
   - Search for student name
   - Verify payment appears in list
3. If payment appears:
   - Wait 5-10 seconds for database update
   - Reload page
4. If payment doesn't appear:
   - May have encountered error during save
   - Try recording payment again

### Issue: Can't Unblock Student's Internet

**Problem**: Unblock button is grayed out or shows error.

**Solutions**:
1. Verify student is actually blocked:
   - Go to **Internet access**
   - Filter: Status = Blocked
   - Search for student
2. Check if student's payment is current:
   - Go to **Students** → student profile
   - If balance is still outstanding, address payment first
3. Try unblocking again with wait of 30 seconds
4. If error persists, try from a different browser
5. Contact system administrator

### Issue: Health Score Changed Unexpectedly

**Problem**: Health score dropped significantly with no obvious reason.

**Solutions**:
1. Review alert notifications:
   - Check what factor(s) changed
   - Review recent transactions/events
2. Check for data entry errors:
   - Was a large attendance mark incorrect?
   - Was a payment recorded incorrectly?
   - Was a student deactivated?
3. View audit log:
   - Go to **Settings** → **"Activity log"**
   - Filter by date and actor
   - Review recent changes
4. Investigate each factor:
   - Click on low-scoring factor
   - Review contributing metrics
   - Check for external events (holidays, exam season)

### Issue: Receipt Not Generated After Payment

**Problem**: Payment was recorded but receipt isn't showing.

**Solutions**:
1. Reload the page
2. Go to **Payments** section and search for student
3. Click payment row to view details
4. Receipt should appear below payment details
5. If still missing:
   - Try recording payment again
   - Check browser's pop-up blocker
   - Try different browser

### Issue: Student's Membership Shows as Expired

**Problem**: Active student's profile shows "Membership expired" but they should still be active.

**Solutions**:
1. Check admission details:
   - Go to **Students** → student profile
   - View **"Admissions"** section
   - Check admission end date
2. If end date is in the past:
   - Membership truly has expired
   - To renew: Click **"Renew membership"**
   - Select plan (1-month, 3-month, annual)
   - A new admission record is created
3. If end date should be future but shows past:
   - There may be data issue
   - Contact owner/system admin
   - Provide student ID and admission details

### Issue: Can't Access Specific Section (Permission Denied)

**Problem**: "You don't have permission to access this section" error.

**Solutions**:
1. Verify your role has access:
   - Students: View only own profile
   - Receptionist: Can't access reports
   - Accountant: Can't modify internet settings
   - Manager: Can't access financial summaries
   - Owner: Has full access
2. If you believe you should have access:
   - Contact library owner
   - Ask them to review your role permissions
   - They can upgrade your access level
3. If access was recently removed:
   - Log out and log in again
   - Permissions update after fresh login

---

## Getting Help

### For Technical Issues

1. **Check this guide**: Search for your issue above
2. **Contact Your Owner**: Library owner has full system access
3. **Check System Status**: Go to **Health** → **"System status"**

### For Account/Credential Issues

- **Forgotten Password**: Contact library owner
- **Account Locked**: Contact library owner
- **Permission Changes**: Request from library owner

### For Feature Requests

1. Note the feature you need
2. Document how you'd use it
3. Send to library owner with details
4. Owner can submit feature request to platform team

---

## Best Practices

### Daily Checklist
- [ ] Review morning alerts
- [ ] Check library health score
- [ ] Record all payments before lunch
- [ ] Monitor internet connectivity
- [ ] Review any low-scoring factors
- [ ] End-of-day: Back up critical data

### Weekly Tasks
- [ ] Generate payment report
- [ ] Review student roster for inactive members
- [ ] Check health score trend
- [ ] Follow up on outstanding payments > 7 days
- [ ] Review audit log for any irregularities

### Monthly Tasks
- [ ] Comprehensive health review
- [ ] Financial reconciliation
- [ ] Membership renewal campaign
- [ ] Facility/service improvements
- [ ] Team feedback and planning

### Data Entry Guidelines
- **Always verify entries** before saving
- **Use consistent naming** for students (First Name Last Name)
- **Record receipt numbers** for cash payments
- **Take payment photos** for digital methods
- **Update student info** immediately for changes
- **Document reasons** for blocking/unblocking

### Security Best Practices
- **Never share** your login credentials
- **Change password** every 3 months
- **Log out** when stepping away from computer
- **Use strong passwords** (mix of upper, lower, numbers, symbols)
- **Report suspicious activity** to owner immediately
- **Clear browser cache** regularly on shared computers

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+/` or `Cmd+/` | Open shortcuts help |
| `Ctrl+K` or `Cmd+K` | Search across app |
| `Ctrl+S` or `Cmd+S` | Save form (when in form) |
| `Escape` | Close dialog or cancel action |
| `Enter` | Submit form or confirm action |
| `Tab` | Move to next form field |
| `Shift+Tab` | Move to previous form field |

---

## Glossary

| Term | Definition |
|------|-----------|
| **Admission** | Student's enrollment record with membership dates and fee structure |
| **Fee Cycle** | Billing period (monthly, quarterly, annual) for which charges are applied |
| **Outstanding Balance** | Total fees owed by student (not yet paid) |
| **Allocation** | Process of assigning payment to specific fee cycles |
| **UPI** | Unified Payments Interface (digital payment method) |
| **Health Score** | Overall operational wellness metric (0-100) |
| **Session** | Student's active internet connection |
| **Audit Log** | Record of all system activities with timestamps and user names |
| **Concession** | Fee discount or waiver applied to a student |
| **Receipt** | Official proof of payment with unique reference number |

---

## Appendix: Sample Workflows

### Workflow A: New Student Onboarding (Complete)

```
1. Student approaches reception
2. Receptionist: Go to Students → Add New → Fill details
3. System: Creates student record with unique ID
4. Receptionist: Select admission plan (1-month = ₹1,500)
5. System: Auto-creates fee cycle
6. Receptionist: Take payment (₹1,500 cash)
7. Go to Payments → Record Payment → Cash method
8. System: Generates receipt (RCP-000001)
9. Receptionist: Print receipt, give to student
10. Student: Gets Wi-Fi login credentials
11. Student: Can access internet immediately
```

**Time**: ~5 minutes per student

### Workflow B: Monthly Fee Collection (Manager's Day)

```
Morning:
1. Go to Dashboard → View "Outstanding" card
2. See 12 students owe fees

Mid-day:
3. Go to Payments → Filter "Overdue" status
4. Call/message students from list
5. As students pay, record immediately
   - Payments → Record Payment
   - Print receipts
6. Update standing with student

End-of-day:
7. Go to Payments section
8. Generate daily cash report
9. Export PDF for financial record
10. Email summary to owner
```

**Target**: Collect 80%+ of monthly fees

---

**Version**: 1.0  
**Last Updated**: October 2026  
**Next Review**: January 2027

For the latest updates, visit the [Platform Documentation](https://docs.library-saas.local) or contact your library owner.

---

*This guide is designed for Library SaaS users. All features are subject to your library's subscription plan and your assigned role.*
