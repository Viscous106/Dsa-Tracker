import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    '30 curated DSA algorithm missions',
    'XP-based progress tracking',
    'Instant intel notes per concept',
    'Gamified rank system',
    'Cheat notes for every topic',
    'Real interview-style questions',
  ];

  return (
    <div className="gy-auth-full">
      {/* Background orbs */}
      <div className="gy-orb gy-orb--tl" style={{ opacity: 0.5 }} />
      <div className="gy-orb gy-orb--br" style={{ opacity: 0.4 }} />

      {/* Logo / brand */}
      <div className="gy-auth-brand">
        <div className="gy-brand-badge">DV</div>
        <span className="gy-auth-brand__name">DSA Veda</span>
      </div>

      <div className="gy-auth-layout">
        {/* Left benefits sidebar (CyberShield join sidebar) */}
        <aside className="gy-auth-sidebar">
          <h3 className="gy-auth-sidebar__title">What You Get</h3>
          <ul className="gy-auth-sidebar__list">
            {perks.map((perk, i) => (
              <li key={i} className="gy-auth-sidebar__item">
                <span className="gy-auth-sidebar__check">✓</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right form panel */}
        <div className="gy-auth-form-panel">
          <p className="gy-kicker" style={{ marginBottom: '0.5rem' }}>NEURAL INTERFACE</p>
          <h2 className="gy-auth-form-title">Welcome Back</h2>
          <p className="gy-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
            Sign in to your account to continue training.
          </p>

          {error && (
            <div className="gy-alert gy-alert--error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="gy-field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="gy-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="gy-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="gy-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="gy-btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Authenticating...' : 'Access Nexus →'}
            </button>
          </form>

          <hr className="gy-divider" />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <Link to="/auth/signup" className="gy-link">Create account</Link>
            <Link to="/auth/forgot-password" style={{ color: 'var(--gy-muted)' }}>Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
