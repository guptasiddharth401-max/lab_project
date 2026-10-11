import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Library SaaS</p>
          <h1>Sign in</h1>
        </div>

        <form className="auth-form">
          <label>
            <span>Email</span>
            <input type="email" defaultValue="owner@library.com" />
          </label>

          <label>
            <span>Password</span>
            <input type="password" defaultValue="owner@123" />
          </label>

          <button type="submit" className="primary-button full-width">
            Enter dashboard
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/">Return to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
