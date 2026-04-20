import { Link } from 'react-router-dom';
import { useGame } from '../../context';
import dsaLevels, { STAGES } from '../../data/levels';

export default function Learn() {
  const { progress } = useGame();
  const completed = new Set(progress.completedLevels);
  const totalDone = progress.completedLevels.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Page header ──────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,255,153,0.06), rgba(0,255,255,0.03))',
        border: '1px solid rgba(0,255,153,0.18)', borderRadius: '1rem',
        padding: '2rem',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,255,153,0.07)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lgrid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="gy-kicker" style={{ marginBottom: '0.4rem' }}>OPERATIONAL MAP</p>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '0.4rem' }}>
              The 30-Mission DSA Campaign
            </h1>
            <p className="gy-muted" style={{ fontSize: '0.875rem', maxWidth: '520px' }}>
              Unlock every DSA operation — from Arrays to Advanced Algorithms.
              Complete missions to earn XP and ascend the ranks.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {totalDone}<span style={{ fontSize: '1rem', color: 'var(--muted-fg)' }}>/30</span>
            </div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--muted-fg)', textTransform: 'uppercase' }}>
              Missions Complete
            </div>
          </div>
        </div>
      </div>

      {/* ── Stage sections ─────────────────────────────────── */}
      {STAGES.map(stage => {
        const stageLevels = dsaLevels.filter(l => l.stage === stage.id);
        const doneCount   = stageLevels.filter(l => completed.has(l.id)).length;
        const stagePct    = Math.round((doneCount / stageLevels.length) * 100);

        return (
          <div key={stage.id}>
            {/* Stage header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              marginBottom: '1rem', padding: '1rem 1.25rem',
              background: 'rgba(26,10,46,0.50)',
              border: '2px solid rgba(0,255,153,0.20)',
              borderRadius: '1rem',
            }}>
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{stage.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <h2 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{stage.title}</h2>
                  <span className="gy-badge gy-badge--primary">{doneCount}/{stageLevels.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(0,255,153,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${stagePct}%`, background: 'linear-gradient(to right, var(--primary), var(--accent))', borderRadius: '999px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted-fg)', flexShrink: 0 }}>
                    {stagePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Mission grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
              {stageLevels.map(level => {
                const isCompleted = completed.has(level.id);
                const isLocked    = !isCompleted && level.id > (progress.completedLevels.length + 1);
                const perf        = progress.missionPerformance[level.id];
                return (
                  <LevelCard key={level.id} level={level}
                    isCompleted={isCompleted} isLocked={isLocked} perf={perf} />
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
  const borderColor = isCompleted
    ? 'rgba(0,255,153,0.35)'
    : isLocked
    ? 'rgba(100,100,100,0.2)'
    : 'rgba(0,255,153,0.18)';

  const card = (
    <div style={{
      position: 'relative',
      background: isLocked ? 'rgba(10,0,21,0.3)' : 'rgba(26,10,46,0.40)',
      border: `1px solid ${borderColor}`,
      borderRadius: '0.75rem',
      padding: '1.25rem',
      opacity: isLocked ? 0.5 : 1,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      backdropFilter: 'blur(12px)',
      height: '100%',
    }}
      onMouseEnter={e => {
        if (isLocked) return;
        e.currentTarget.style.borderColor = 'rgba(0,255,153,0.5)';
        e.currentTarget.style.boxShadow   = '0 0 20px rgba(0,255,153,0.12)';
        e.currentTarget.style.transform   = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow   = 'none';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      {/* Completed tick */}
      {isCompleted && (
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          width: '22px', height: '22px', borderRadius: '50%',
          background: 'var(--primary)', color: '#0a0015',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 800,
          boxShadow: '0 0 8px rgba(0,255,153,0.5)',
        }}>✓</div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted-fg)', letterSpacing: '0.08em' }}>
          MISSION {String(level.id).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className={`gy-badge gy-badge--${isCompleted ? 'success' : isLocked ? 'danger' : 'cyan'}`}>
            {isCompleted ? '✓ Done' : isLocked ? '🔒 Locked' : 'Open'}
          </span>
        </div>
      </div>

      <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.4rem', lineHeight: 1.4, paddingRight: isCompleted ? '1.5rem' : 0 }}>
        {level.title}
      </h4>
      <p className="gy-muted" style={{ fontSize: '0.78rem', lineHeight: 1.55, margin: '0 0 0.75rem' }}>
        {level.scenario}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="gy-badge gy-badge--accent">+{level.xpReward} XP</span>
        {perf && (
          <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
            ✓ attempt #{perf.breakthroughAttempt}
          </span>
        )}
        {!isLocked && !isCompleted && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>Deploy →</span>
        )}
      </div>
    </div>
  );

  if (isLocked) return card;
  return <Link to={`/challenge/${level.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>;
}
