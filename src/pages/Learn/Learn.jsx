import { Link } from 'react-router-dom';
import { useGame } from '../../context';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Learn() {
  const { progress } = useGame();
  const completed = new Set(progress.completedLevels);

  return (
    <div>
      <div className="gy-card" style={{ marginBottom: '2rem', padding: '1.75rem 2rem' }}>
        <p className="gy-kicker">OPERATIONAL MAP</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>The 30-Mission DSA Campaign</h1>
        <p className="gy-muted" style={{ marginTop: '0.4rem', fontSize: '0.9rem', maxWidth: '600px' }}>
          Unlock the full spectrum of DSA operations. Progress from arrays to advanced algorithms.
          Complete missions to earn XP and master each topic.
        </p>
      </div>

      {STAGES.map(stage => {
        const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
        return (
          <div key={stage.id} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.9rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gy-glass-border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>{stage.icon}</span>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{stage.title}</h2>
                <p className="gy-muted" style={{ fontSize: '0.8rem', margin: 0 }}>{stage.subtitle}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="gy-badge gy-badge--primary">
                  {stageLevels.filter(l => completed.has(l.id)).length}/{stageLevels.length}
                </span>
              </div>
            </div>

            <div className="gy-grid gy-grid-2">
              {stageLevels.map(level => {
                const isCompleted = completed.has(level.id);
                const isLocked = !isCompleted && level.id > (progress.completedLevels.length + 1);
                const perf = progress.missionPerformance[level.id];

                return (
                  <LevelCard
                    key={level.id}
                    level={level}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    perf={perf}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LevelCard({ level, isCompleted, isLocked, perf }) {
  const cardClass = `gy-level-card ${isCompleted ? 'gy-level-card--completed' : ''} ${isLocked ? 'gy-level-card--locked' : ''}`;
  const content = (
    <div className={cardClass} style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '0.68rem', color: 'var(--gy-muted)', letterSpacing: '0.08em' }}>
              LEVEL {String(level.id).padStart(2, '0')}
            </span>
            <span className={`gy-badge gy-badge--${isCompleted ? 'success' : isLocked ? 'danger' : 'cyan'}`}>
              {isCompleted ? '✓ Done' : isLocked ? '🔒 Locked' : 'Available'}
            </span>
          </div>
          <h4 style={{ fontWeight: 800, margin: '0 0 0.3rem', fontSize: '1rem' }}>{level.title}</h4>
          <p className="gy-muted" style={{ fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{level.scenario}</p>
          {perf && (
            <p style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '0.4rem', fontFamily: 'var(--gy-font-mono)' }}>
              Breakthrough: attempt #{perf.breakthroughAttempt}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className="gy-badge gy-badge--accent">+{level.xpReward} XP</span>
        </div>
      </div>
    </div>
  );

  if (isLocked) return content;
  return <Link to={`/challenge/${level.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
}
