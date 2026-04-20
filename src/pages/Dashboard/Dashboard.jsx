/**
 * Dashboard.jsx
 *
 * Demonstrates:
 *  - useProgress custom hook (useMemo internally for derived stats)
 *  - Conditional rendering (loading, empty, data states)
 *  - Lists & Keys (session history map)
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useProgress } from '../../hooks';
import dsaLevels from '../../data/levels';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    progress,
    completedCount,
    totalLevels,
    pct,
    currentLevel,
    xpToNext,
    rank,
    nextLevel,
    sessionHistory,
  } = useProgress();

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="gy-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <p className="gy-kicker">ALGORITHM CONTROL PANEL</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>
          Mission Control Console
        </h1>
        <p className="gy-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Welcome back,{' '}
          <strong style={{ color: 'var(--fg)' }}>
            {user?.displayName || user?.email}
          </strong>
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="gy-grid gy-grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard label="XP Balance"          value={progress.xp.toLocaleString()} icon="⚡" color="var(--primary)" />
        <StatCard label="Missions Completed"   value={`${completedCount} / ${totalLevels}`} icon="✅" color="var(--accent)" />
        <StatCard label="Current Rank"         value={rank} icon="🏅"                       color="var(--secondary)" />
      </div>

      {/* ── Next Mission + XP Progress ── */}
      <div className="gy-grid gy-grid-2" style={{ marginBottom: '1.5rem' }}>

        {/* Next mission card */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>NEXT OBJECTIVE</p>
          {nextLevel ? (
            <>
              <h3 style={{ fontWeight: 800, marginBottom: '0.35rem' }}>
                Mission {nextLevel.id}
              </h3>
              <p className="gy-muted" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {nextLevel.concept} — {nextLevel.scenario}
              </p>
              <span className="gy-badge gy-badge--primary">+{nextLevel.xpReward} XP</span>
              <div style={{ marginTop: '1rem' }}>
                <Link className="gy-btn" to={`/challenge/${nextLevel.id}`}
                  style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
                  Deploy →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ fontWeight: 700 }}>All {totalLevels} missions complete!</p>
              <p className="gy-muted" style={{ fontSize: '0.875rem' }}>You are a DSA Master</p>
            </div>
          )}
        </div>

        {/* XP progress card */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>XP PROGRESS</p>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              <span className="gy-muted">Level {currentLevel}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                {xpToNext} XP to next
              </span>
            </div>
            <div className="gy-progress">
              <div className="gy-progress__fill" style={{ width: `${progress.xp % 100}%` }} />
            </div>
          </div>
          <p className="gy-muted" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>
            Campaign: {pct}% complete
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/challenges" style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
              View All Missions →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Session History ── */}
      <div className="gy-card">
        <p className="gy-kicker" style={{ marginBottom: '1rem' }}>SESSION HISTORY</p>
        {sessionHistory.length === 0 ? (
          <p className="gy-muted" style={{ fontSize: '0.875rem' }}>
            No data yet. Deploy to the arena to begin neural mapping.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {sessionHistory.map((item) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(0,255,153,0.03)',
                border: '1px solid rgba(0,255,153,0.12)',
                borderRadius: '12px', padding: '0.75rem 1rem', gap: '1rem',
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted-fg)' }}>
                    MISSION {String(item.id).padStart(2, '0')} VALIDATED
                  </span>
                  <p style={{ fontWeight: 700, margin: '0.15rem 0', fontSize: '0.9rem' }}>{item.title}</p>
                  <p className="gy-muted" style={{ fontSize: '0.78rem' }}>
                    Breakthrough at Attempt #{item.breakthroughAttempt}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="gy-badge gy-badge--primary">+{item.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color }}>
        {value}
      </div>
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
}
