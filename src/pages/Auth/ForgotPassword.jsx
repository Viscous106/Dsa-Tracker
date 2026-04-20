import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
    <div className="gy-auth-page">
      <div className="gy-auth-card">
        <div className="gy-auth-logo">
          <div className="gy-brand-badge">DV</div>
          <span>DSA Veda</span>
        </div>
        <p className="gy-kicker" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>SYSTEM RECOVERY</p>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="gy-field">
            <label>Email Address</label>
            <input className="gy-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className="gy-btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Sending...' : 'Send Recovery Link'}
          </button>
        </form>

        <hr className="gy-divider" />
        <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          <Link to="/auth/login" style={{ color: '#a5b4fc' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
