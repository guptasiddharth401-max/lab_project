export default function HomePage() {
  const stats = [
    { label: 'Active seats', value: '63 / 80', trend: '+4.2%' },
    { label: 'Occupancy', value: '79%', trend: '+6.0%' },
    { label: 'Today collection', value: '₹8,450', trend: '+₹1,120' },
    { label: 'Attendance', value: '74 / 80', trend: '+3 visitors' },
  ];

  const alerts = [
    { title: 'Membership expiring soon', detail: '12 students renew within 3 days.' },
    { title: 'Fee due', detail: '₹2,300 pending from 5 overdue cycles.' },
    { title: 'Internet issue', detail: 'Router node 2 signal dropped at 11:40 AM.' },
    { title: 'Router offline', detail: 'OpenNDS gateway heartbeat exceeded 3 mins.' },
  ];

  const quickActions = ['New Student', 'Seats', 'Money', 'Attendance', 'Internet', 'Health'];

  const recentStudents = [
    { name: 'Rahul Sharma', id: 'LIB001', status: 'Active', plan: 'Monthly' },
    { name: 'Priya Singh', id: 'LIB002', status: 'Due', plan: 'Quarterly' },
    { name: 'Amit Kumar', id: 'LIB003', status: 'Active', plan: 'Monthly' },
    { name: 'Neha Patel', id: 'LIB004', status: 'Warning', plan: 'Monthly' },
  ];

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Operations</p>
          <h1>Library SaaS Dashboard</h1>
        </div>
        <nav className="top-actions">
          <button className="ghost-button">Export</button>
          <button className="primary-button">+ Add student</button>
        </nav>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <strong>{stat.value}</strong>
            <span className="stat-trend">{stat.trend}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Smart alerts</h2>
            <span className="badge warning">4 active</span>
          </div>

          <div className="alert-list">
            {alerts.map((alert) => (
              <div key={alert.title} className="alert-row">
                <div className="alert-dot" />
                <div>
                  <h3>{alert.title}</h3>
                  <p>{alert.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Quick actions</h2>
          </div>
          <div className="action-grid">
            {quickActions.map((action) => (
              <button key={action} className="action-button">
                {action}
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Recent students</h2>
          <a href="/students">View all</a>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>
                  <span className={`status-pill ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td>{student.plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
