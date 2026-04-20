import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signup(email, password, name);
      setDone(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Signup failed.');
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
      <div className="gy-orb gy-orb--tl" style={{ opacity: 0.5 }} />
      <div className="gy-orb gy-orb--br" style={{ opacity: 0.4 }} />

      <div className="gy-auth-brand">
        <div className="gy-brand-badge">DV</div>
        <span className="gy-auth-brand__name">DSA Veda</span>
      </div>

      <div className="gy-auth-layout">
        {/* Benefits sidebar */}
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

        {/* Form panel */}
        <div className="gy-auth-form-panel">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div className="gy-success-icon">✓</div>
              <h2 className="gy-auth-form-title" style={{ color: 'var(--gy-primary)' }}>Welcome Aboard!</h2>
              <p className="gy-muted" style={{ marginTop: '0.75rem' }}>Your profile has been created. Entering the Nexus…</p>
            </div>
          ) : (
            <>
              <p className="gy-kicker" style={{ marginBottom: '0.5rem' }}>INITIALIZE NEURAL PROFILE</p>
              <h2 className="gy-auth-form-title">Create Account</h2>
              <p className="gy-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                Join DSA Veda and start your training mission.
              </p>

              {error && <div className="gy-alert gy-alert--error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="gy-field">
                  <label htmlFor="signup-name">Display Name</label>
                  <input id="signup-name" className="gy-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="gy-field">
                  <label htmlFor="signup-email">Email Address</label>
                  <input id="signup-email" className="gy-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="gy-field">
                  <label htmlFor="signup-password">Password</label>
                  <input id="signup-password" className="gy-input" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                  <span style={{ fontSize: '0.75rem', color: 'var(--gy-muted)', marginTop: '0.25rem' }}>Must be at least 6 characters</span>
                </div>
                <button className="gy-btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                  {loading ? 'Creating Profile...' : 'Join the Nexus →'}
                </button>
              </form>

              <hr className="gy-divider" />
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gy-muted)' }}>
                Already have an account? <Link to="/auth/login" className="gy-link">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
