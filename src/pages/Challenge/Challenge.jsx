/**
 * Challenge.jsx
 *
 * Demonstrates:
 *  - useCallback  — stable handler references (handleSelect, handleNext)
 *  - useRef       — scroll-to-top on level change without re-render
 *  - useState     — selected answer, status, attempts
 *  - Controlled form elements (quiz options)
 *  - Conditional rendering (idle / correct / wrong states)
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context';
import dsaLevels from '../../data/levels';

export default function Challenge() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { progress, dispatch } = useGame();

  const levelId = parseInt(id, 10);
  const level   = dsaLevels.find((l) => l.id === levelId);

  const [selected,            setSelected]            = useState(null);
  const [status,              setStatus]              = useState('idle');
  const [attempts,            setAttempts]            = useState(0);
  const [breakthroughAttempt, setBreakthroughAttempt] = useState(null);

  // useRef: DOM reference used to scroll the answer panel to the top
  const panelRef = useRef(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSelected(null);
    setStatus('idle');
    setAttempts(0);
    setBreakthroughAttempt(null);
  }, [levelId]);

  if (!level) return (
    <div className="gy-card" style={{ textAlign: 'center', padding: '48px' }}>
      <p style={{ fontSize: '16px', fontWeight: 600 }}>Challenge not found.</p>
      <button className="gy-btn" onClick={() => navigate('/challenges')}
        style={{ marginTop: '16px' }}>← Back to challenges</button>
    </div>
  );

  const alreadyDone = progress.completedLevels.includes(levelId);

  // useCallback: memoises handleSelect
  const handleSelect = useCallback((idx) => {
    if (status !== 'idle') return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelected(idx);

    if (idx === level.correctIndex) {
      const bt = breakthroughAttempt ?? newAttempts;
      setBreakthroughAttempt(bt);
      setStatus('correct');

      if (!alreadyDone) {
        dispatch({
          type: 'COMPLETE_MISSION',
          payload: {
            levelId,
            xpReward: level.xpReward,
            attempts: newAttempts,
            breakthroughAttempt: bt,
          },
        });
      }
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        setSelected(null);
      }, 900);
    }
  }, [status, attempts, level, levelId, alreadyDone, breakthroughAttempt, dispatch]);

  // useCallback: stable reference for next-level navigation
  const handleNext = useCallback(() => {
    const next = dsaLevels.find((l) => l.id === levelId + 1);
    navigate(next ? `/challenge/${next.id}` : '/challenges');
  }, [levelId, navigate]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button className="gy-btn-ghost" onClick={() => navigate('/challenges')}>← Back</button>
        <div>
          <span className="gy-kicker">#{String(level.id).padStart(2, '0')} · {level.concept}</span>
          <h2 style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '16px' }}>{level.title}</h2>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="gy-badge gy-badge--primary">+{level.xpReward} XP</span>
        </div>
      </div>

      <div className="gy-grid gy-grid-2" style={{ alignItems: 'start' }}>

        {/* Left: Question panel */}
        <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gy-card">
            <p className="gy-kicker" style={{ marginBottom: '12px' }}>Question</p>

            <div style={{
              background: 'var(--surface)', borderRadius: '4px',
              padding: '16px', marginBottom: '16px',
              borderLeft: '3px solid var(--accent)',
            }}>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                SCENARIO
              </p>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '13px' }}>{level.scenario}</p>
            </div>

            <h4 style={{ marginBottom: '16px', lineHeight: 1.5, fontSize: '14px', fontWeight: 600 }}>
              {level.question}
            </h4>

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
                  <button key={idx} className={cls}
                    onClick={() => handleSelect(idx)}
                    disabled={status === 'correct'}>
                    <span style={{ color: 'var(--fg-subtle)', marginRight: '8px' }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance */}
          <div className="gy-card" style={{ padding: '16px 20px' }}>
            <p className="gy-kicker" style={{ marginBottom: '12px' }}>Performance</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--fg)' }}>
                  {attempts}
                </div>
                <div style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', fontWeight: 600 }}>
                  Attempts
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 700, color: 'var(--fg)' }}>
                  {breakthroughAttempt ?? '—'}
                </div>
                <div style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', fontWeight: 600 }}>
                  Solved on
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Intel / Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {status === 'correct' ? (
            <div className="gy-card" style={{
              borderColor: 'rgba(22,163,74,0.40)',
              background: 'var(--success-dim)',
              textAlign: 'center', padding: '32px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <p className="gy-kicker" style={{ color: 'var(--success)' }}>Correct</p>
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginTop: '8px' }}>Well done</h3>
              <p className="gy-muted" style={{ fontSize: '13px', margin: '8px 0' }}>
                Concept: <strong style={{ color: 'var(--fg)' }}>{level.concept}</strong>
              </p>
              {!alreadyDone && (
                <span className="gy-badge gy-badge--success" style={{ fontSize: '11px' }}>
                  +{level.xpReward} XP earned
                </span>
              )}
              {alreadyDone && (
                <span className="gy-badge gy-badge--primary">Already solved — no extra XP</span>
              )}
              <div style={{ marginTop: '20px' }}>
                <button className="gy-btn" onClick={handleNext}>
                  {levelId < 30 ? 'Next challenge →' : 'View all challenges'}
                </button>
              </div>
            </div>
          ) : (
            <div className="gy-card">
              <p className="gy-kicker" style={{ marginBottom: '12px' }}>Status</p>
              <p className="gy-muted" style={{ fontSize: '13px' }}>
                Select the correct answer to earn XP.
              </p>
            </div>
          )}

          {/* Concept notes */}
          <div className="gy-card">
            <p className="gy-kicker" style={{ marginBottom: '16px' }}>Concept — {level.concept}</p>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>EXPLANATION</p>
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '13px' }}>{level.intel.simple}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>USAGE</p>
              <div className="code-block">{level.intel.usage}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>EXAMPLE</p>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
                {level.intel.example}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>WHY</p>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6 }}>{level.intel.why}</p>
            </div>

            <div>
              <p style={{ fontSize: '11px', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                KEY STEPS
              </p>
              {level.intel.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{
                    width: '20px', height: '20px', minWidth: '20px',
                    background: 'var(--accent)', color: '#fff',
                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ lineHeight: 1.5, paddingTop: '1px' }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
