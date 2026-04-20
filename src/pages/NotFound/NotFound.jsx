import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌌</div>
      <p className="gy-kicker">ERROR 404</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>Lost in the Void</h1>
      <p className="gy-muted" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        This mission sector does not exist in the DSA nexus.
      </p>
      <Link className="gy-btn" to="/">Return to Base</Link>
    </div>
  );
}
