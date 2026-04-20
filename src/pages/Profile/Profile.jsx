import { useAuth } from '../../context';
import { useGame } from '../../context';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Profile() {
  const { user, logout } = useAuth();
  const { progress, dispatch } = useGame();
  const completedCount = progress.completedLevels.length;
  const totalXP = progress.xp;
  const rank = totalXP < 200 ? '🥉 Recruit' : totalXP < 500 ? '🥈 Initiate' : totalXP < 1000 ? '🥇 Specialist' : totalXP < 2000 ? '💎 Expert' : '👑 Master';

  const handleReset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      dispatch({ type: 'RESET' });
    }
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="gy-card" style={{ marginBottom: '1.5rem', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
          background: 'linear-gradient(135deg, var(--gy-primary), var(--gy-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 800, boxShadow: '0 0 30px rgba(99,102,241,0.4)',
        }}>
          {(user?.displayName || user?.email || '?')[0].toUpperCase()}
        </div>
        <h2 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{user?.displayName || 'Anonymous Agent'}</h2>
        <p className="gy-muted" style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>{user?.email}</p>
        <span style={{ fontSize: '1.1rem' }}>{rank}</span>
      </div>

      {/* Stats */}
      <div className="gy-grid gy-grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard label="Total XP" value={totalXP.toLocaleString()} icon="⚡" color="var(--gy-primary)" />
        <StatCard label="Missions Done" value={`${completedCount}/30`} icon="✅" color="var(--gy-success)" />
        <StatCard label="Stage Progress" value={`${Math.round((completedCount/30)*100)}%`} icon="📊" color="var(--gy-accent)" />
      </div>

      {/* Stage breakdown */}
      <div className="gy-card" style={{ marginBottom: '1.5rem' }}>
        <p className="gy-kicker" style={{ marginBottom: '1rem' }}>STAGE BREAKDOWN</p>
        {STAGES.map(stage => {
          const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
          const doneInStage = stageLevels.filter(l => progress.completedLevels.includes(l.id)).length;
          const pct = Math.round((doneInStage / stageLevels.length) * 100);
          return (
            <div key={stage.id} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{stage.icon} {stage.title}</span>
                <span style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '0.8rem', color: 'var(--gy-muted)' }}>{doneInStage}/{stageLevels.length}</span>
              </div>
              <div className="gy-progress">
                <div className="gy-progress__fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="gy-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="gy-btn" onClick={logout}>Logout</button>
        <button className="gy-btn-ghost" onClick={handleReset} style={{ color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}>
          Reset Progress
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '1.8rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}
