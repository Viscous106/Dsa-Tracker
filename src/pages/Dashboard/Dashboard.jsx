import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useProgress } from '../../hooks';
import dsaLevels from '../../data/levels';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    progress, completedCount, totalLevels, pct,
    currentLevel, xpToNext, xpIntoLevel,
    rank, nextLevel, sessionHistory,
  } = useProgress();

  const greeting = getGreeting();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Hero banner ─────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,255,153,0.08), rgba(0,255,255,0.04))',
        border: '1px solid rgba(0,255,153,0.20)',
        borderRadius: '1rem', padding: '2rem',
      }}>
        {/* Subtle grid bg */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,255,153,0.08)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dgrid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="gy-kicker" style={{ marginBottom: '0.4rem' }}>
            {greeting} — MISSION CONTROL
          </p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '0.4rem' }}>
            Welcome back,{' '}
            <span style={{ color: 'var(--primary)' }}>
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
          </h1>
          <p className="gy-muted" style={{ fontSize: '0.9rem' }}>
            {completedCount === 0
              ? 'Deploy your first mission to begin XP accumulation.'
              : `${completedCount} missions validated · ${rank} · ${pct}% campaign complete`}
          </p>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <StatCard value={progress.xp.toLocaleString()} label="XP Balance"        color="var(--primary)"   icon="⚡" />
        <StatCard value={`${completedCount}/${totalLevels}`} label="Missions Done" color="var(--accent)"    icon="✅" />
        <StatCard value={`Lv. ${currentLevel}`}             label="XP Level"      color="var(--secondary)" icon="🏅" />
        <StatCard value={rank}                              label="Rank"           color="var(--primary)"   icon="👑" hideFont />
      </div>

      {/* ── Two-column mid section ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Next mission */}
        <div className="gy-glass-card">
          <p className="gy-kicker" style={{ marginBottom: '1rem' }}>NEXT OBJECTIVE</p>
          {nextLevel ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted-fg)' }}>
                  MISSION {String(nextLevel.id).padStart(2, '0')}
                </span>
                <span className="gy-badge gy-badge--primary">+{nextLevel.xpReward} XP</span>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                {nextLevel.title}
              </h3>
              <p className="gy-muted" style={{ fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                {nextLevel.scenario}
              </p>
              <Link className="gy-btn" to={`/challenge/${nextLevel.id}`}
                style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
                Deploy Mission →
              </Link>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ fontWeight: 700, color: 'var(--primary)' }}>All {totalLevels} Missions Complete!</p>
              <p className="gy-muted" style={{ fontSize: '0.875rem', marginTop: '0.35rem' }}>You have achieved DSA Mastery</p>
            </div>
          )}
        </div>

        {/* XP level progress */}
        <div className="gy-glass-card">
          <p className="gy-kicker" style={{ marginBottom: '1rem' }}>XP PROGRESS</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
            <span className="gy-muted">Level {currentLevel}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
              {xpToNext} XP to next
            </span>
          </div>
          <div className="gy-progress">
            <div className="gy-progress__fill" style={{ width: `${xpIntoLevel}%` }} />
          </div>

          <div style={{ margin: '1.25rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <MiniStat label="Total XP"     value={progress.xp} color="var(--primary)" />
            <MiniStat label="Campaign"     value={`${pct}%`}  color="var(--accent)" />
          </div>

          <div className="gy-progress" style={{ marginTop: 0 }}>
            <div className="gy-progress__fill" style={{ width: `${pct}%`, background: 'linear-gradient(to right, var(--accent), var(--secondary))' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.3rem' }}>
            <span className="gy-muted">0%</span>
            <span className="gy-muted">Campaign {pct}%</span>
            <span className="gy-muted">100%</span>
          </div>
        </div>
      </div>

      {/* ── Session history ──────────────────────────────────── */}
      <div className="gy-glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <p className="gy-kicker">SESSION HISTORY</p>
          <Link to="/challenges" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
            View All →
          </Link>
        </div>

        {sessionHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted-fg)', fontSize: '0.875rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡</div>
            No session data yet. Deploy to the arena to begin neural mapping.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {sessionHistory.map((item) => (
              <Link key={item.id} to={`/challenge/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(0,255,153,0.03)', border: '1px solid rgba(0,255,153,0.12)',
                  borderRadius: '12px', padding: '0.875rem 1rem',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,153,0.35)'; e.currentTarget.style.background = 'rgba(0,255,153,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,153,0.12)'; e.currentTarget.style.background = 'rgba(0,255,153,0.03)'; }}
                >
                  {/* Level badge */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(0,255,153,0.15), rgba(0,255,255,0.08))',
                    border: '1px solid rgba(0,255,153,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)',
                  }}>
                    L{String(item.id).padStart(2, '0')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </p>
                    <p className="gy-muted" style={{ fontSize: '0.75rem', margin: '0.1rem 0 0' }}>
                      {item.concept} · Breakthrough #{item.breakthroughAttempt}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="gy-badge gy-badge--primary">+{item.xpReward} XP</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon, hideFont }) {
  return (
    <div className="gy-glass-card" style={{ textAlign: 'center', padding: '1.25rem 1rem' }}>
      <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{icon}</div>
      <div style={{
        fontFamily: hideFont ? 'inherit' : 'var(--font-mono)',
        fontSize: hideFont ? '0.95rem' : '1.5rem',
        fontWeight: 800, color,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
        {label}
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(100,100,100,0.15)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.65rem', color: 'var(--muted-fg)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.15rem' }}>{label}</div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '🌅 GOOD MORNING';
  if (h < 17) return '☀️ GOOD AFTERNOON';
  return '🌙 GOOD EVENING';
}
