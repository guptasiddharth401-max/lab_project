import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Payments', href: '/payments' },
  { label: 'Internet', href: '/internet' },
  { label: 'Health', href: '/health' },
];

const sessions = [
  { id: 'INT-2001', student: 'Rahul Sharma', status: 'Active', download: '5.2 GB', usage: '52%' },
  { id: 'INT-2002', student: 'Amit Kumar', status: 'Blocked', download: '0.0 GB', usage: '0%' },
  { id: 'INT-2003', student: 'Neha Patel', status: 'Warning', download: '1.7 GB', usage: '18%' },
];

export default function InternetPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Network</p>
          <h1>Internet access</h1>
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
          <span className="stat-label">Active sessions</span>
          <strong>28</strong>
          <span className="stat-trend">+3 this morning</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Blocked users</span>
          <strong>7</strong>
          <span className="stat-trend">2 overdue</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Router health</span>
          <strong>96%</strong>
          <span className="stat-trend">Stable</span>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Session monitor</h2>
          <button className="ghost-button">Refresh</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Session</th>
              <th>Student</th>
              <th>Status</th>
              <th>Download</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.id}</td>
                <td>{session.student}</td>
                <td>
                  <span className={`status-pill ${session.status.toLowerCase()}`}>{session.status}</span>
                </td>
                <td>{session.download}</td>
                <td>{session.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
