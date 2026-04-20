import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';

// Google icon SVG (official brand colors)
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

export default function Login() {
  const { user, login, loginWithGoogle } = useAuth();
  const navigate       = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
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

      <div className="gy-auth-header">
        <h1>Sign In to <span style={{ color: 'var(--accent)' }}>DSA Veda</span></h1>
        <p>Get started with your algorithm training in seconds</p>
      </div>

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
          <p className="gy-kicker" style={{ marginBottom: '0.5rem' }}>NEURAL INTERFACE</p>
          <h2 className="gy-auth-form-title">Welcome Back</h2>
          <p className="gy-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Sign in to continue your training mission.
          </p>

          {error && <div className="gy-alert gy-alert--error">{error}</div>}

          {/* ── Google Sign-In ── */}
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
            {gLoading ? 'Connecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,153,0.12)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,153,0.12)' }} />
          </div>

          {/* ── Email / Password form ── */}
          <form onSubmit={handleSubmit}>
            <div className="gy-field">
              <label htmlFor="login-email">Email Address</label>
              <input id="login-email" className="gy-input" type="email"
                placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="gy-field">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" className="gy-input" type="password"
                placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="gy-btn" type="submit" disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Authenticating…' : 'Access Nexus →'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--muted-fg)' }}>
              No account?{' '}
              <Link to="/auth/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign Up</Link>
            </span>
            <Link to="/auth/forgot-password" style={{ color: 'var(--muted-fg)' }}>Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Human-readable Firebase error messages
function friendlyError(code) {
  const map = {
    'auth/user-not-found':       'No account found with this email.',
    'auth/wrong-password':        'Incorrect password. Try again.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/invalid-credential':    'Email or password is incorrect.',
    'auth/too-many-requests':     'Too many attempts. Please wait a few minutes.',
    'auth/operation-not-allowed': 'Sign-in method not enabled. Enable Email/Password in Firebase Console → Authentication → Sign-in method.',
    'auth/network-request-failed':'Network error. Check your connection.',
  };
  return map[code] ?? `Authentication error: ${code}`;
}
