/**
 * Dashboard.jsx
 * Clean data layout — no cyber copy, no gradients, no inline glow effects.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useProgress } from '../../hooks';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    progress, completedCount, totalLevels, pct,
    currentLevel, xpToNext, xpIntoLevel,
    rank, nextLevel, sessionHistory,
  } = useProgress();

  const name = user?.displayName || user?.email?.split('@')[0] || 'User';
  const greeting = getGreeting();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Welcome banner ─────────────────────────────── */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '6px', padding: '32px',
      }}>
        <p className="gy-kicker" style={{ marginBottom: '8px' }}>
          {greeting}
        </p>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
          Welcome back, {name}
        </h1>
        <p className="gy-muted" style={{ fontSize: '14px' }}>
          {completedCount === 0
            ? 'Start your first challenge to begin tracking progress.'
            : `${completedCount} solved · ${rank} · ${pct}% complete`}
        </p>
      </div>

      {/* ── Stats row ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        <Stat icon="⚡" value={progress.xp.toLocaleString()} label="Total XP" />
        <Stat icon="✅" value={`${completedCount}/${totalLevels}`} label="Solved" />
        <Stat icon="📊" value={`Lv. ${currentLevel}`} label="Level" />
        <Stat icon="🏅" value={rank} label="Rank" isText />
      </div>

      {/* ── Two-column: next challenge + XP progress ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Next challenge */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '16px' }}>Next challenge</p>
          {nextLevel ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-subtle)' }}>
                  #{String(nextLevel.id).padStart(2, '0')}
                </span>
                <span className="gy-badge gy-badge--primary">+{nextLevel.xpReward} XP</span>
              </div>
              <h3 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                {nextLevel.title}
              </h3>
              <p className="gy-muted" style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                {nextLevel.scenario}
              </p>
              <Link className="gy-btn" to={`/challenge/${nextLevel.id}`}>
                Start →
              </Link>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
              <p style={{ fontWeight: 600 }}>All {totalLevels} challenges complete</p>
              <p className="gy-muted" style={{ fontSize: '13px', marginTop: '4px' }}>You've reached mastery.</p>
            </div>
          )}
        </div>

        {/* XP progress */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '16px' }}>XP progress</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
            <span className="gy-muted">Level {currentLevel}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
              {xpToNext} XP to next
            </span>
          </div>
          <div className="gy-progress">
            <div className="gy-progress__fill" style={{ width: `${xpIntoLevel}%` }} />
          </div>

          <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <MiniStat label="Total XP" value={progress.xp} />
            <MiniStat label="Campaign" value={`${pct}%`} />
          </div>

          <div className="gy-progress">
            <div className="gy-progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px', color: 'var(--fg-subtle)' }}>
            <span>0%</span>
            <span>{pct}% complete</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* ── Session history ─────────────────────────── */}
      <div className="gy-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p className="gy-kicker">Recent activity</p>
          <Link to="/challenges" className="gy-link" style={{ fontSize: '13px' }}>
            View all →
          </Link>
        </div>

        {sessionHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: '13px' }}>
            No activity yet. Complete a challenge to see it here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessionHistory.map((item) => (
              <Link key={item.id} to={`/challenge/${item.id}`} style={{ color: 'inherit' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: '4px', padding: '12px 16px',
                  transition: 'border-color 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0,
                    background: 'var(--card-hover)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--fg-muted)',
                  }}>
                    {String(item.id).padStart(2, '0')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </p>
                    <p className="gy-muted" style={{ fontSize: '11px', margin: '2px 0 0' }}>
                      {item.concept} · attempt #{item.breakthroughAttempt}
                    </p>
                  </div>

                  <span className="gy-badge gy-badge--primary">+{item.xpReward} XP</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, icon, isText }) {
  return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '20px 16px' }}>
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{
        fontFamily: isText ? 'var(--font-sans)' : 'var(--font-mono)',
        fontSize: isText ? '14px' : '24px',
        fontWeight: 700, color: 'var(--fg)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--fg-subtle)', fontWeight: 600, marginTop: '4px',
      }}>
        {label}
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{
      textAlign: 'center', padding: '12px',
      background: 'var(--surface)', borderRadius: '4px',
      border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--fg)' }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
