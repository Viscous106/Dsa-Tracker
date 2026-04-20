/**
 * Learn.jsx — Challenge list page
 * Clean list layout, no gradients, no backdrop-filter, no glowing borders.
 */
import { Link } from 'react-router-dom';
import { useGame } from '../../context';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Learn() {
  const { progress } = useGame();
  const completed = new Set(progress.completedLevels);
  const totalDone = progress.completedLevels.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Page header */}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '6px', padding: '32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p className="gy-kicker" style={{ marginBottom: '8px' }}>Challenges</p>
            <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              30 DSA Challenges
            </h1>
            <p className="gy-muted" style={{ fontSize: '13px', maxWidth: '480px' }}>
              Work through every topic — arrays, trees, graphs, DP, and more.
              Complete challenges to earn XP and track your progress.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--fg)' }}>
              {totalDone}<span style={{ fontSize: '14px', color: 'var(--fg-subtle)' }}>/30</span>
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--fg-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
              Solved
            </div>
          </div>
        </div>
      </div>

      {/* Stages */}
      {STAGES.map(stage => {
        const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
        const doneCount   = stageLevels.filter(l => completed.has(l.id)).length;
        const stagePct    = Math.round((doneCount / stageLevels.length) * 100);

        return (
          <div key={stage.id}>
            {/* Stage header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '16px', padding: '16px 20px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{stage.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <h2 style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>{stage.title}</h2>
                  <span className="gy-badge gy-badge--primary">{doneCount}/{stageLevels.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="gy-progress" style={{ flex: 1 }}>
                    <div className="gy-progress__fill" style={{ width: `${stagePct}%` }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-subtle)', flexShrink: 0 }}>
                    {stagePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Challenge grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {stageLevels.map(level => {
                const isDone   = completed.has(level.id);
                const isLocked = !isDone && level.id > (progress.completedLevels.length + 1);
                const perf     = progress.missionPerformance[level.id];
                return (
                  <ChallengeCard key={level.id} level={level}
                    isDone={isDone} isLocked={isLocked} perf={perf} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChallengeCard({ level, isDone, isLocked, perf }) {
  const card = (
    <div style={{
      background: 'var(--card)',
      border: `1px solid ${isDone ? 'rgba(22,163,74,0.35)' : 'var(--border)'}`,
      borderRadius: '6px',
      padding: '20px',
      opacity: isLocked ? 0.5 : 1,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      transition: 'border-color 0.1s',
      height: '100%',
    }}
      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isDone ? 'rgba(22,163,74,0.35)' : 'var(--border)'; }}
    >
      {/* Completed marker */}
      {isDone && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'var(--success)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 700,
        }}>✓</div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--fg-subtle)', letterSpacing: '0.06em' }}>
          #{String(level.id).padStart(2, '0')}
        </span>
        <span className={`gy-badge gy-badge--${isDone ? 'success' : isLocked ? 'danger' : 'primary'}`}>
          {isDone ? 'Solved' : isLocked ? 'Locked' : 'Open'}
        </span>
      </div>

      <h4 style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 8px', lineHeight: 1.4 }}>
        {level.title}
      </h4>
      <p className="gy-muted" style={{ fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px' }}>
        {level.scenario}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="gy-badge gy-badge--primary">+{level.xpReward} XP</span>
        {perf && (
          <span style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>
            attempt #{perf.breakthroughAttempt}
          </span>
        )}
        {!isLocked && !isDone && (
          <span style={{ fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 500 }}>Start →</span>
        )}
      </div>
    </div>
  );

  if (isLocked) return card;
  return <Link to={`/challenge/${level.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>;
}
