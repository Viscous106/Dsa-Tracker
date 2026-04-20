import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export default function Signup() {
  const { user, signup, loginWithGoogle } = useAuth();
  const navigate         = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [done, setDone]         = useState(false);

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
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err.code));
      }
    } finally {
      setGLoading(false);
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
      <div className="gy-orb gy-orb--tl" />
      <div className="gy-orb gy-orb--br" />

      {!done && (
        <div className="gy-auth-header">
          <h1>Join <span style={{ color: 'var(--accent)' }}>DSA Veda</span></h1>
          <p>Get started with enterprise-grade DSA training in minutes</p>
        </div>
      )}

      <div className="gy-auth-layout">
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

        <div className="gy-auth-form-panel">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div className="gy-success-icon">✓</div>
              <h2 style={{ color: 'var(--accent)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '.75rem' }}>
                Welcome Aboard!
              </h2>
              <p className="gy-muted" style={{ fontSize: '1.05rem' }}>
                Profile created. Entering the Nexus…
              </p>
            </div>
          ) : (
            <>
              <p className="gy-kicker" style={{ marginBottom: '0.5rem' }}>INITIALIZE NEURAL PROFILE</p>
              <h2 className="gy-auth-form-title">Create Account</h2>
              <p className="gy-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Join DSA Veda and start your training mission.
              </p>

              {error && <div className="gy-alert gy-alert--error">{error}</div>}

              {/* ── Google Sign-Up ── */}
              <button
                onClick={handleGoogle}
                disabled={gLoading}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  background: 'rgba(255,255,255,0.07)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: '9999px',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem', fontWeight: 600,
                  padding: '0.7rem 1.5rem',
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                <GoogleIcon />
                {gLoading ? 'Connecting…' : 'Sign up with Google'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,153,0.12)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,153,0.12)' }} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="gy-field">
                  <label htmlFor="su-name">Display Name</label>
                  <input id="su-name" className="gy-input" type="text"
                    placeholder="Your name" value={name}
                    onChange={e => setName(e.target.value)} required />
                </div>
                <div className="gy-field">
                  <label htmlFor="su-email">Email Address</label>
                  <input id="su-email" className="gy-input" type="email"
                    placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="gy-field">
                  <label htmlFor="su-password">Password</label>
                  <input id="su-password" className="gy-input" type="password"
                    placeholder="Min. 6 characters" value={password}
                    onChange={e => setPassword(e.target.value)} required />
                  <span>Must be at least 6 characters</span>
                </div>
                <button className="gy-btn" type="submit" disabled={loading}
                  style={{ width: '100%', marginTop: '0.5rem' }}>
                  {loading ? 'Creating Profile…' : 'Join the Nexus →'}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--muted-fg)', marginTop: '1.25rem' }}>
                Already have an account?{' '}
                <Link to="/auth/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use':  'An account with this email already exists.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/weak-password':         'Password is too weak — use at least 6 characters.',
    'auth/operation-not-allowed': 'Sign-in method not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/network-request-failed':'Network error. Check your connection.',
    'auth/popup-blocked':         'Popup was blocked by your browser. Allow popups for this site.',
  };
  return map[code] ?? `Signup error: ${code}`;
}
