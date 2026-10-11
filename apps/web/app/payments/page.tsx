import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Payments', href: '/payments' },
  { label: 'Internet', href: '/internet' },
  { label: 'Health', href: '/health' },
];

const payments = [
  { id: 'PAY-1042', student: 'Rahul Sharma', amount: '₹1,500', method: 'UPI', time: 'Today, 09:30' },
  { id: 'PAY-1041', student: 'Neha Patel', amount: '₹950', method: 'Cash', time: 'Today, 08:15' },
  { id: 'PAY-1040', student: 'Sonia Verma', amount: '₹2,200', method: 'UPI', time: 'Yesterday' },
];

export default function PaymentsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Finance</p>
          <h1>Payments</h1>
        </div>
        <nav className="nav-row">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="stats-grid compact-grid">
        <article className="stat-card">
          <span className="stat-label">Cash today</span>
          <strong>₹4,260</strong>
          <span className="stat-trend">+₹650</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">UPI today</span>
          <strong>₹6,150</strong>
          <span className="stat-trend">+₹1,120</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Outstanding</span>
          <strong>₹8,450</strong>
          <span className="stat-trend">12 records</span>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Recent payments</h2>
          <button className="primary-button">+ Record payment</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.student}</td>
                <td>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
