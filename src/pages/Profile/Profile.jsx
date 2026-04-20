/**
 * Profile.jsx
 * Clean profile layout — no SVG gradient rings, no glow shadows.
 */
import { useAuth, useGame } from '../../context';
import { useProgress } from '../../hooks';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Profile() {
  const { user, logout } = useAuth();
  const { resetProgress } = useGame();
  const { progress, completedCount, totalLevels, pct, rank, currentLevel, xpToNext } = useProgress();

  const initial = (user?.displayName || user?.email || '?')[0].toUpperCase();

  const handleReset = async () => {
    if (window.confirm('Reset all progress? This clears XP, missions, and Firestore data. Cannot be undone.')) {
      await resetProgress();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Profile header */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '6px', padding: '32px',
        display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '4px', flexShrink: 0,
          background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: 700,
        }}>
          {initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontWeight: 700, fontSize: '18px', margin: '0 0 4px' }}>
            {user?.displayName || 'Anonymous'}
          </h2>
          <p className="gy-muted" style={{ fontSize: '13px', margin: '0 0 8px' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="gy-badge gy-badge--primary">{rank}</span>
            <span className="gy-badge gy-badge--primary">Level {currentLevel}</span>
            <span className="gy-badge gy-badge--primary">{progress.xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Completion stat */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '30px', fontWeight: 700, color: 'var(--fg)' }}>
            {pct}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: '4px' }}>
            Complete
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total XP',   value: progress.xp.toLocaleString() },
          { label: 'Solved',     value: `${completedCount}/${totalLevels}` },
          { label: 'Level',      value: `Lv. ${currentLevel}` },
          { label: 'XP to next', value: `${xpToNext}` },
        ].map(s => (
          <div key={s.label} className="gy-card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--fg)' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Stage breakdown */}
      <div className="gy-card">
        <p className="gy-kicker" style={{ marginBottom: '20px' }}>Stage breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STAGES.map(stage => {
            const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
            const done = stageLevels.filter(l => progress.completedLevels.includes(l.id)).length;
            const p = Math.round((done / stageLevels.length) * 100);
            return (
              <div key={stage.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600 }}>{stage.icon} {stage.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', fontSize: '11px' }}>
                    {done}/{stageLevels.length} · {p}%
                  </span>
                </div>
                <div className="gy-progress">
                  <div className="gy-progress__fill" style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account actions */}
      <div className="gy-card">
        <p className="gy-kicker" style={{ marginBottom: '20px' }}>Account</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="gy-btn" onClick={logout}>Sign out</button>
          <button className="gy-btn-ghost" onClick={handleReset}
            style={{ color: 'var(--danger)', borderColor: 'rgba(220,38,38,0.25)' }}
          >
            Reset progress
          </button>
        </div>
        <p className="gy-muted" style={{ fontSize: '11px', marginTop: '12px' }}>
          Reset clears all XP, missions, and Firestore data. This cannot be undone.
        </p>
      </div>
    </div>
  );
}
