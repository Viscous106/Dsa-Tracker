import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

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
    '30 curated DSA challenges',
    'XP-based progress tracking',
    'Concept notes per topic',
    'Rank progression system',
    'Searchable cheat notes',
    'Real interview-style questions',
  ];

  return (
    <div className="gy-auth-full">
      <div className="gy-auth-header">
        <h1>Sign in to DSA Veda</h1>
        <p>Pick up where you left off.</p>
      </div>

      <div className="gy-auth-layout">
        <aside className="gy-auth-sidebar">
          <h3 className="gy-auth-sidebar__title">What you get</h3>
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
          <h2 className="gy-auth-form-title">Welcome back</h2>
          <p className="gy-muted" style={{ marginBottom: '24px', fontSize: '13px' }}>
            Sign in to continue.
          </p>

          {error && <div className="gy-alert gy-alert--error">{error}</div>}

          {/* Google sign-in */}
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="gy-btn-ghost"
            style={{
              width: '100%',
              justifyContent: 'center',
              gap: '12px',
              height: '40px',
              marginBottom: '20px',
            }}
          >
            <GoogleIcon />
            {gLoading ? 'Connecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit}>
            <div className="gy-field">
              <label htmlFor="login-email">Email</label>
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
              style={{ width: '100%', height: '36px', marginTop: '8px' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '13px' }}>
            <span style={{ color: 'var(--fg-muted)' }}>
              No account?{' '}
              <Link to="/auth/signup" className="gy-link">Sign up</Link>
            </span>
            <Link to="/auth/forgot-password" style={{ color: 'var(--fg-muted)', fontSize: '13px' }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
