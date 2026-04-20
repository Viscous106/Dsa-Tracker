import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Recovery link sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gy-auth-full">
      <div className="gy-orb gy-orb--tl" />
      <div className="gy-orb gy-orb--br" />

      {/* Centered header */}
      <div className="gy-auth-header" style={{ marginBottom: '2rem' }}>
        <h1>
          Recover Your{' '}
          <span style={{ color: 'var(--accent)' }}>Account</span>
        </h1>
        <p>We'll send a password reset link to your email</p>
      </div>

      {/* Single-column card — max 480px */}
      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div className="gy-auth-form-panel">
          <div className="gy-auth-brand" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="gy-brand-badge">DV</div>
            <span style={{ fontWeight: 700 }}>DSA Veda</span>
          </div>

          <p className="gy-kicker" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            SYSTEM RECOVERY
          </p>

          {error   && <div className="gy-alert gy-alert--error">{error}</div>}
          {message && <div className="gy-alert gy-alert--success">{message}</div>}

          {!message && (
            <form onSubmit={handleSubmit}>
              <div className="gy-field">
                <label htmlFor="fp-email">Email Address</label>
                <input id="fp-email" className="gy-input" type="email"
                  placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button className="gy-btn" type="submit" disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-fg)', marginTop: '1.5rem' }}>
            <Link to="/auth/login" style={{ color: 'var(--accent)' }}>← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
