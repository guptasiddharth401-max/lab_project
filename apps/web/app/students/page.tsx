import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Payments', href: '/payments' },
  { label: 'Internet', href: '/internet' },
  { label: 'Health', href: '/health' },
];

export default function StudentsPage() {
  const students = [
    { name: 'Rahul Sharma', id: 'LIB001', status: 'Active', plan: 'Monthly', due: '₹0' },
    { name: 'Priya Singh', id: 'LIB002', status: 'Due', plan: 'Quarterly', due: '₹1,500' },
    { name: 'Amit Kumar', id: 'LIB003', status: 'Active', plan: 'Monthly', due: '₹0' },
    { name: 'Neha Patel', id: 'LIB004', status: 'Warning', plan: 'Monthly', due: '₹950' },
    { name: 'Sonia Verma', id: 'LIB005', status: 'Active', plan: 'Annual', due: '₹0' },
  ];

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Management</p>
          <h1>Students</h1>
        </div>
        <nav className="nav-row">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Student roster</h2>
          <button className="primary-button">+ Add student</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>
                  <span className={`status-pill ${student.status.toLowerCase()}`}>{student.status}</span>
                </td>
                <td>{student.plan}</td>
                <td>{student.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
