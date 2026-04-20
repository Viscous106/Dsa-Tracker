import { useGame } from '../../context';
import { useAuth } from '../../context';
import { Link } from 'react-router-dom';
import dsaLevels from '../../data/levels';

export default function Dashboard() {
  const { progress } = useGame();
  const { user } = useAuth();
  const completedCount = progress.completedLevels.length;
  const nextLevelId = completedCount + 1;
  const nextLevel = dsaLevels.find(l => l.id === nextLevelId);
  const xpToNext = (Math.floor(progress.xp / 100) + 1) * 100 - progress.xp;
  const currentRank = progress.xp < 200 ? 'Recruit' : progress.xp < 500 ? 'Initiate' : progress.xp < 1000 ? 'Specialist' : progress.xp < 2000 ? 'Expert' : 'Master';

  const sessionHistory = Object.entries(progress.missionPerformance)
    .map(([id, stats]) => {
      const lv = dsaLevels.find(l => l.id === parseInt(id));
      return lv ? { ...lv, ...stats } : null;
    })
    .filter(Boolean)
    .reverse()
    .slice(0, 8);

  return (
    <div>
      <div className="gy-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <p className="gy-kicker">ALGORITHM CONTROL PANEL</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>Mission Control Console</h1>
        <p className="gy-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Welcome back, <strong style={{ color: 'var(--gy-text)' }}>{user?.displayName || user?.email}</strong>
        </p>
      </div>

      {/* Stats Row */}
      <div className="gy-grid gy-grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard label="XP Balance" value={progress.xp.toLocaleString()} icon="⚡" accent="#6366f1" />
        <StatCard label="Missions Completed" value={`${completedCount} / 30`} icon="✅" accent="#10b981" />
        <StatCard label="Current Rank" value={currentRank} icon="🏅" accent="#f59e0b" />
      </div>

      <div className="gy-grid gy-grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Next Mission */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>NEXT OBJECTIVE</p>
          {nextLevel ? (
            <>
              <h3 style={{ fontWeight: 800, marginBottom: '0.35rem' }}>Initiate Mission {nextLevel.id}</h3>
              <p className="gy-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {nextLevel.concept} — {nextLevel.scenario}
              </p>
              <span className="gy-badge gy-badge--accent">+{nextLevel.xpReward} XP</span>
              <div style={{ marginTop: '1rem' }}>
                <Link className="gy-btn" to={`/challenge/${nextLevel.id}`} style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem' }}>
                  Deploy →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ fontWeight: 700 }}>All 30 missions complete!</p>
              <p className="gy-muted" style={{ fontSize: '0.875rem' }}>You are a DSA Master</p>
            </div>
          )}
        </div>

        {/* XP to next level */}
        <div className="gy-card">
          <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>XP PROGRESS</p>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
              <span className="gy-muted">Level {Math.floor(progress.xp / 100) + 1}</span>
              <span style={{ fontFamily: 'var(--gy-font-mono)', color: '#a5b4fc' }}>{xpToNext} XP to next rank</span>
            </div>
            <div className="gy-progress">
              <div className="gy-progress__fill" style={{ width: `${(progress.xp % 100)}%` }} />
            </div>
          </div>
          <p className="gy-muted" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
            System state: {progress.xp < 500 ? 'Foundational' : progress.xp < 1500 ? 'Advanced' : 'Expert'} protocol mastery.
            Prepare for next synchronization.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/challenges" style={{ color: '#a5b4fc', fontSize: '0.875rem', fontWeight: 600 }}>
              View All Missions →
            </Link>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="gy-card">
        <p className="gy-kicker" style={{ marginBottom: '1rem' }}>SESSION HISTORY</p>
        {sessionHistory.length === 0 ? (
          <p className="gy-muted" style={{ fontSize: '0.875rem' }}>
            No historical data available. Deploy to the arena to begin neural mapping.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {sessionHistory.map((item) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gy-glass-border)',
                borderRadius: '12px', padding: '0.75rem 1rem', gap: '1rem',
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '0.72rem', color: 'var(--gy-muted)' }}>
                    MISSION {String(item.id).padStart(2, '0')} VALIDATED
                  </span>
                  <p style={{ fontWeight: 700, margin: '0.15rem 0', fontSize: '0.9rem' }}>{item.title}</p>
                  <p className="gy-muted" style={{ fontSize: '0.78rem' }}>
                    Breakthrough at Attempt #{item.breakthroughAttempt}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="gy-badge gy-badge--success">+{item.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '1.8rem', fontWeight: 800, color: accent }}>{value}</div>
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}
