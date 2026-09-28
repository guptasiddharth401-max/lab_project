const stats = [
  { label: 'Seats', value: '63 / 80' },
  { label: 'Occupancy', value: '79%' },
  { label: 'Today's collection', value: '₹8,450' },
  { label: 'Attendance', value: '74 / 80' },
];

const alerts = [
  'Membership expiring soon',
  'Fee due',
  'Internet issue',
  'Router offline',
];

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Library SaaS Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', background: '#f9fafb' }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem', background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Smart Alerts</h2>
          <ul style={{ paddingLeft: 18, lineHeight: 2 }}>
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        </section>

        <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem', background: '#fff' }}>
          <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {['New Student', 'Seats', 'Money', 'Attendance', 'Internet', 'Health'].map((action) => (
              <button key={action} style={{ padding: '0.7rem 1rem', borderRadius: 10, border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer' }}>
                {action}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
