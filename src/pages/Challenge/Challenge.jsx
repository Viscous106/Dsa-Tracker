import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context';
import dsaLevels from '../../data/levels';

export default function Challenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, dispatch } = useGame();
  const levelId = parseInt(id);
  const level = dsaLevels.find(l => l.id === levelId);

  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [attempts, setAttempts] = useState(0);
  const [breakthroughAttempt, setBreakthroughAttempt] = useState(null);

  if (!level) return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '3rem' }}>
      <p style={{ fontSize: '1.2rem' }}>Mission not found.</p>
      <button className="gy-btn" onClick={() => navigate('/challenges')} style={{ marginTop: '1rem' }}>← Back to Campaign</button>
    </div>
  );

  const alreadyDone = progress.completedLevels.includes(levelId);

  const handleSelect = (idx) => {
    if (status !== 'idle') return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelected(idx);

    if (idx === level.correctIndex) {
      setStatus('correct');
      const breakthrough = breakthroughAttempt || newAttempts;
      setBreakthroughAttempt(breakthrough);
      if (!alreadyDone) {
        dispatch({
          type: 'COMPLETE_MISSION',
          payload: { levelId, xpReward: level.xpReward, attempts: newAttempts, breakthroughAttempt: breakthrough },
        });
      }
    } else {
      setStatus('wrong');
      setTimeout(() => { setStatus('idle'); setSelected(null); }, 1000);
    }
  };

  const handleNext = () => {
    const nextLevel = dsaLevels.find(l => l.id === levelId + 1);
    if (nextLevel) navigate(`/challenge/${nextLevel.id}`);
    else navigate('/challenges');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="gy-btn-ghost" onClick={() => navigate('/challenges')}>← Campaign</button>
        <div>
          <span className="gy-kicker">LEVEL {String(level.id).padStart(2, '0')} — {level.concept}</span>
          <h2 style={{ margin: '0.2rem 0 0', fontWeight: 800 }}>{level.title}</h2>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="gy-badge gy-badge--accent">+{level.xpReward} XP</span>
        </div>
      </div>

      <div className="gy-grid gy-grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Mission Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="gy-card">
            <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>MISSION CONTROL</p>

            <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', borderLeft: '3px solid var(--gy-primary)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.35rem' }}>SCENARIO</p>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{level.scenario}</p>
            </div>

            <h4 style={{ marginBottom: '1rem', lineHeight: 1.5 }}>🎯 {level.question}</h4>

            <div>
              {level.options.map((opt, idx) => {
                let cls = 'gy-option';
                if (selected === idx) {
                  if (status === 'correct') cls += ' gy-option--correct';
                  else if (status === 'wrong') cls += ' gy-option--wrong';
                  else cls += ' gy-option--selected';
                } else if (status === 'correct' && idx === level.correctIndex) {
                  cls += ' gy-option--correct';
                }
                return (
                  <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={status === 'correct'}>
                    <span style={{ color: 'var(--gy-muted)', marginRight: '0.5rem' }}>{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance */}
          <div className="gy-card" style={{ padding: '1rem 1.25rem' }}>
            <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>MISSION PERFORMANCE</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gy-secondary)' }}>{attempts}</div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)' }}>Total Trials</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#6ee7b7' }}>{breakthroughAttempt || '—'}</div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)' }}>Success Point</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Intel / Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {status === 'correct' ? (
            <div className="gy-card" style={{ borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.05)', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
              <p className="gy-kicker" style={{ color: '#6ee7b7' }}>MISSION SUCCESSFUL</p>
              <h3 style={{ fontWeight: 800, marginTop: '0.5rem' }}>PROTOCOL VALIDATED</h3>
              <p className="gy-muted" style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>
                Concept Mastered: <strong style={{ color: 'var(--gy-text)' }}>{level.concept}</strong>
              </p>
              {!alreadyDone && <span className="gy-badge gy-badge--success" style={{ fontSize: '0.85rem' }}>+{level.xpReward} XP Earned! 🔥</span>}
              {alreadyDone && <span className="gy-badge gy-badge--cyan">Already completed — no extra XP</span>}
              <div style={{ marginTop: '1.25rem' }}>
                <button className="gy-btn" onClick={handleNext}>
                  {levelId < 30 ? 'Next Mission →' : '🏆 View Campaign'}
                </button>
              </div>
            </div>
          ) : (
            <div className="gy-card">
              <p className="gy-kicker" style={{ marginBottom: '0.75rem' }}>MISSION IN PROGRESS</p>
              <p className="gy-muted" style={{ fontSize: '0.875rem' }}>Deploy the correct answer to earn XP and validate protocol.</p>
            </div>
          )}

          {/* Intel Panel */}
          <div className="gy-card">
            <p className="gy-kicker" style={{ marginBottom: '1rem' }}>INTEL REPORT — {level.concept}</p>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>// SIMPLE</p>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{level.intel.simple}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>USAGE</p>
              <div className="code-block">{level.intel.usage}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>EXAMPLE</p>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: '#a5f3fc' }}>{level.intel.example}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>WHY</p>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>{level.intel.why}</p>
            </div>

            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.5rem' }}>3 KEY STEPS</p>
              {level.intel.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ width: '22px', height: '22px', background: 'var(--gy-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ lineHeight: 1.5, paddingTop: '0.1rem' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
