import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Payments', href: '/payments' },
  { label: 'Internet', href: '/internet' },
  { label: 'Health', href: '/health' },
];

const healthFactors = [
  { label: 'Seat utilization', value: '79%', status: 'Healthy' },
  { label: 'Payment health', value: '87%', status: 'Healthy' },
  { label: 'Membership health', value: '81%', status: 'Healthy' },
  { label: 'Attendance rate', value: '74%', status: 'Watch' },
  { label: 'Internet health', value: '92%', status: 'Healthy' },
];

export default function HealthPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Library health</h1>
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
        <article className="stat-card highlight-card">
          <span className="stat-label">Overall score</span>
          <strong>89/100</strong>
          <span className="stat-trend success">Healthy</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Open alerts</span>
          <strong>4</strong>
          <span className="stat-trend">Needs review</span>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Health factors</h2>
        </div>
        <div className="health-grid">
          {healthFactors.map((factor) => (
            <div key={factor.label} className="health-card">
              <span>{factor.label}</span>
              <strong>{factor.value}</strong>
              <small>{factor.status}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
