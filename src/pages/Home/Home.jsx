/**
 * Home.jsx — Hero + Features + Stats
 * CyberShield layout: full-height hero with two-column grid,
 * dashboard preview card with SVG grid bg, features section
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useProgress } from '../../hooks';

export default function Home() {
  const { user } = useAuth();
  const { progress, completedCount, totalLevels, pct, rank } = useProgress();

  const features = [
    { icon: '⚡', title: 'Interactive Missions', desc: 'Solve 30 real DSA interview scenarios with instant feedback, hints, and Intel reports — not just theory.', accent: 'var(--primary)' },
    { icon: '🏆', title: 'XP & Rank System',    desc: 'Earn XP on every mission. Climb from Recruit → Master as your algorithm skills sharpen.', accent: 'var(--accent)' },
    { icon: '📖', title: 'Instant Cheat Notes',  desc: 'One-click access to searchable, structured notes for every algorithm and data structure topic.', accent: 'var(--secondary)' },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="gy-hero-section">
        <div className="gy-orb gy-orb--tl" />
        <div className="gy-orb gy-orb--br" />

        <div className="gy-hero-grid">
          {/* Left column */}
          <div className="gy-hero-col">
            <div className="gy-hero-eyebrow">
              <span style={{ color: 'var(--primary)' }}>◆</span>
              <span>NEURAL TRAINING PROTOCOL ACTIVE</span>
            </div>

            <h1 className="gy-hero-title">
              <span className="gy-gradient-text">Master the</span>
              <br />
              <span className="gy-gradient-text">DSA Universe</span>
            </h1>

            <p className="gy-hero-sub">
              The world's most advanced interactive DSA simulator. Deploy your skills across
              30 algorithm missions, earn XP, and become a legendary code architect.
            </p>

            {/* Campaign progress bar (only shown once started) */}
            {completedCount > 0 && (
              <div className="gy-hero-progress">
                <div className="gy-hero-progress__labels">
                  <span className="gy-muted" style={{ fontSize: '0.8rem' }}>Campaign Progress</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.8rem' }}>
                    {completedCount}/{totalLevels} missions · {rank}
                  </span>
                </div>
                <div className="gy-progress" style={{ marginTop: 0 }}>
                  <div className="gy-progress__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}

            <div className="gy-hero-actions">
              <Link className="gy-btn" to="/challenges">
                {completedCount > 0 ? '⚡ Continue Training' : '🚀 Start Training'}
              </Link>
              <Link className="gy-btn-outline" to="/dsa-cheat-notes">
                📖 Cheat Notes
              </Link>
            </div>

            {/* Trust tags only on first visit */}
            {completedCount === 0 && (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {['30 Missions', 'XP System', 'Firestore Sync'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--muted-fg)' }}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Dashboard preview */}
          <div className="gy-hero-preview">
            <div className="gy-preview-card">
              {/* SVG grid background (exact CyberShield pattern) */}
              <div className="gy-preview-grid-bg">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,153,0.10)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#pgrid)" />
                </svg>
              </div>

              <div className="gy-preview-content">
                <div className="gy-preview-header">
                  <h3>Training Console</h3>
                  <div className="gy-preview-live">
                    <div className="gy-live-dot" />
                    <span>Live</span>
                  </div>
                </div>

                <div className="gy-preview-stats">
                  <div className="gy-preview-stat gy-preview-stat--green">
                    <p className="gy-preview-stat__label">Missions Done</p>
                    <p className="gy-preview-stat__value">{completedCount}</p>
                  </div>
                  <div className="gy-preview-stat gy-preview-stat--cyan">
                    <p className="gy-preview-stat__label">XP Balance</p>
                    <p className="gy-preview-stat__value">{progress.xp.toLocaleString()}</p>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="gy-preview-chart">
                  {[35, 55, 45, 75, 50, 85, 60].map((h, i) => (
                    <div key={i} className="gy-preview-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>

                <div className="gy-preview-activity">
                  <p className="gy-preview-activity__label">ACTIVITY LOG</p>
                  {[
                    { text: 'Arrays protocol mastered',   col: 'var(--primary)' },
                    { text: 'Linked Lists completed',      col: 'var(--accent)' },
                    { text: 'Neural interface connected',  col: 'var(--muted-fg)' },
                  ].map((item, i) => (
                    <div key={i} className="gy-preview-activity__item">
                      <span style={{ color: item.col, fontSize: '0.55rem' }}>◆</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating XP badge */}
            <div className="gy-xp-badge">
              <div className="gy-xp-badge__value">{progress.xp.toLocaleString()}</div>
              <div className="gy-xp-badge__label">XP BALANCE</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section className="gy-features-section">
        <div className="gy-section-center">
          <h2 className="gy-section-title">Core Training Modules</h2>
          <p className="gy-section-sub">
            Everything you need to crush DSA interviews, in one coherent simulation.
          </p>
        </div>
        <div className="gy-features-grid">
          {features.map((f, i) => (
            <div key={i} className="gy-feature-card">
              <span className="gy-feature-card__icon" style={{ animationDelay: `${i * 0.4}s` }}>
                {f.icon}
              </span>
              <h3 className="gy-feature-card__title" style={{ color: f.accent }}>{f.title}</h3>
              <p className="gy-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          QUICK STATS (only when started)
      ═══════════════════════════════════════════ */}
      {completedCount > 0 && (
        <section className="gy-stats-section">
          <div className="gy-glass-card">
            <p className="gy-kicker" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              OPERATIONAL STATS · {user?.displayName || user?.email?.split('@')[0]}
            </p>
            <div className="gy-stats-grid">
              <StatItem value={progress.xp.toLocaleString()} label="XP Earned" />
              <StatItem value={`${completedCount} / ${totalLevels}`} label="Missions Done" />
              <StatItem value={`${pct}%`} label="Campaign Complete" />
              <StatItem value={rank} label="Current Rank" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="gy-stat">
      <div className="gy-stat__value">{value}</div>
      <div className="gy-stat__label">{label}</div>
    </div>
  );
}
