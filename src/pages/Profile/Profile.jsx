import { useAuth } from '../../context';
import { useGame } from '../../context';
import { useProgress } from '../../hooks';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Profile() {
  const { user, logout }    = useAuth();
  const { resetProgress }   = useGame();
  const { progress, completedCount, totalLevels, pct, rank, currentLevel, xpToNext } = useProgress();

  const initial = (user?.displayName || user?.email || '?')[0].toUpperCase();

  const handleReset = async () => {
    if (window.confirm('Reset ALL progress? This also clears Firestore. This cannot be undone.')) {
      await resetProgress();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Profile hero ─────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'rgba(26,10,46,0.50)',
        border: '2px solid rgba(0,255,153,0.20)',
        borderRadius: '1rem', padding: '2rem',
        display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 800, color: '#0a0015',
          boxShadow: '0 0 30px rgba(0,255,153,0.35)',
        }}>
          {initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="gy-kicker" style={{ marginBottom: '0.3rem' }}>AGENT PROFILE</p>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.displayName || 'Anonymous Agent'}
          </h2>
          <p className="gy-muted" style={{ fontSize: '0.875rem', margin: '0 0 0.65rem' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="gy-badge gy-badge--primary">{rank}</span>
            <span className="gy-badge gy-badge--cyan">Level {currentLevel}</span>
            <span className="gy-badge gy-badge--accent">{progress.xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Campaign ring summary */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto' }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(0,255,153,0.1)" strokeWidth="7" />
              <circle cx="40" cy="40" r="33" fill="none" stroke="url(#pring)" strokeWidth="7"
                strokeDasharray={`${(pct / 100) * 207.3} 207.3`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)" />
              <defs>
                <linearGradient id="pring" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
              {pct}%
            </div>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted-fg)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.4rem' }}>
            Campaign
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total XP',    value: progress.xp.toLocaleString(), color: 'var(--primary)'   },
          { label: 'Missions',    value: `${completedCount}/${totalLevels}`, color: 'var(--accent)' },
          { label: 'XP Level',    value: `Lv. ${currentLevel}`,        color: 'var(--secondary)' },
          { label: 'XP to Next',  value: `${xpToNext} XP`,            color: 'var(--primary)'   },
        ].map(s => (
          <div key={s.label} className="gy-glass-card" style={{ textAlign: 'center', padding: '1.1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted-fg)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Stage breakdown ───────────────────────────────── */}
      <div className="gy-glass-card">
        <p className="gy-kicker" style={{ marginBottom: '1.25rem' }}>STAGE BREAKDOWN</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {STAGES.map(stage => {
            const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
            const done = stageLevels.filter(l => progress.completedLevels.includes(l.id)).length;
            const p    = Math.round((done / stageLevels.length) * 100);
            return (
              <div key={stage.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>{stage.icon} {stage.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-fg)', fontSize: '0.8rem' }}>
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

      {/* ── Account actions ───────────────────────────────── */}
      <div className="gy-glass-card">
        <p className="gy-kicker" style={{ marginBottom: '1.25rem' }}>ACCOUNT ACTIONS</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="gy-btn" onClick={logout}>
            Sign Out
          </button>
          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255,23,68,0.08)',
              border: '2px solid rgba(255,23,68,0.30)',
              color: '#ff8096',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.82rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,23,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,23,68,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,23,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,23,68,0.30)'; }}
          >
            🗑 Reset All Progress
          </button>
        </div>
        <p className="gy-muted" style={{ fontSize: '0.75rem', marginTop: '0.875rem' }}>
          Reset will clear all XP, missions, and Firestore data. This action cannot be undone.
        </p>
      </div>
    </div>
  );
}
