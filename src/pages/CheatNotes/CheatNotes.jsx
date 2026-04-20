import { useState } from 'react';
import dsaLevels from '../../data/levels';

export default function CheatNotes() {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = dsaLevels.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.concept.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOpen = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div>
      <div className="gy-card" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <p className="gy-kicker">KNOWLEDGE BASE</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>DSA Cheat Notes</h1>
        <p className="gy-muted" style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Click any concept and read easy notes directly below it. 30 algorithms + data structures.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <input
            className="gy-input"
            type="text"
            placeholder="Search concept (e.g. arrays, tree, DP...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '420px' }}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="gy-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="gy-muted">No concepts found for "{search}"</p>
        </div>
      )}

      <div>
        {filtered.map(level => (
          <div key={level.id} className="gy-cheat-item" onClick={() => toggleOpen(level.id)}>
            <div className="gy-cheat-item__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--gy-font-mono)', fontSize: '0.68rem', color: 'var(--gy-muted)' }}>
                  L{String(level.id).padStart(2, '0')}
                </span>
                <h4 style={{ margin: 0, fontWeight: 700 }}>{level.title}</h4>
                <span className="gy-badge gy-badge--primary">{level.concept}</span>
              </div>
              <span className={`gy-cheat-item__chevron ${openId === level.id ? 'gy-cheat-item__chevron--open' : ''}`}>▼</span>
            </div>

            {openId === level.id && (
              <div className="gy-cheat-item__body" onClick={e => e.stopPropagation()}>
                <div className="gy-grid gy-grid-2" style={{ gap: '1.25rem' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>// SIMPLE</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{level.intel.simple}</p>

                    <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginTop: '1rem', marginBottom: '0.3rem' }}>USAGE</p>
                    <div className="code-block" style={{ fontSize: '0.8rem' }}>{level.intel.usage}</div>

                    <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginTop: '1rem', marginBottom: '0.3rem' }}>WHY IT WORKS</p>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{level.intel.why}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.3rem' }}>EXAMPLE</p>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: '#a5f3fc', margin: '0 0 1rem' }}>{level.intel.example}</p>

                    <p style={{ fontSize: '0.72rem', color: 'var(--gy-muted)', fontFamily: 'var(--gy-font-mono)', marginBottom: '0.5rem' }}>3 KEY STEPS</p>
                    {level.intel.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        <span style={{ width: '20px', height: '20px', minWidth: '20px', background: 'var(--gy-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800 }}>{i + 1}</span>
                        <span style={{ lineHeight: 1.5 }}>{step}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="gy-badge gy-badge--accent">+{level.xpReward} XP Mission</span>
                      <span className="gy-badge gy-badge--primary">Stage {level.stage}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
