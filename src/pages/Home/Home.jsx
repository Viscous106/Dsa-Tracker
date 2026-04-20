import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useGame } from '../../context';
import dsaLevels from '../../data/levels';

export default function Home() {
  const { user } = useAuth();
  const { progress } = useGame();
  const completedCount = progress.completedLevels.length;
  const totalLevels = dsaLevels.length;
  const pct = Math.round((completedCount / totalLevels) * 100);

  const features = [
    {
      icon: '⚡',
      title: 'Instant Mastery',
      desc: 'Simulate real coding interview scenarios in a risk-free neural environment. Learn by doing, not just reading.',
      color: 'var(--gy-primary)',
    },
    {
      icon: '🏆',
      title: 'Gamified Path',
      desc: '30 levels of increasing complexity. Earn XP, track your progress, and benchmark your DSA IQ.',
      color: 'var(--gy-secondary)',
    },
    {
      icon: '🛠️',
      title: 'Advanced Intel',
      desc: 'Deep technical notes for every algorithm and data structure — always one click away.',
      color: 'var(--gy-accent)',
    },
  ];

  return (
    <>
      {/* ── Hero (CyberShield full-width, two-column) ── */}
      <section className="gy-hero-section">
        {/* Decorative orb blobs */}
        <div className="gy-orb gy-orb--tl" />
        <div className="gy-orb gy-orb--br" />

        <div className="gy-hero-grid">
          {/* Left column */}
          <div className="gy-hero-col">
            <div className="gy-hero-eyebrow">
              <span>✦</span>
              <span>NEURAL PROTOCOL ACTIVE</span>
            </div>

            <h1 className="gy-hero-title">
              <span className="gy-gradient-text">Master the</span>
              <br />
              <span className="gy-gradient-text">DSA Multiverse</span>
            </h1>

            <p className="gy-hero-sub">
              The world's most advanced interactive DSA training simulator. Deploy your skills,
              conquer algorithm missions, and become a legendary code architect.
            </p>

            {/* Progress bar if started */}
            {completedCount > 0 && (
              <div className="gy-hero-progress">
                <div className="gy-hero-progress__labels">
                  <span className="gy-muted">Campaign Progress</span>
                  <span className="gy-mono">{completedCount}/{totalLevels} missions</span>
                </div>
                <div className="gy-progress">
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
          </div>

          {/* Right column — Dashboard preview card */}
          <div className="gy-hero-preview">
            <div className="gy-preview-card">
              {/* Grid SVG background */}
              <div className="gy-preview-grid-bg">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="pgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,255,153,0.12)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#pgrid)" />
                </svg>
              </div>

              <div className="gy-preview-content">
                <div className="gy-preview-header">
                  <h3>Training Dashboard</h3>
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
                    <p className="gy-preview-stat__label">XP Earned</p>
                    <p className="gy-preview-stat__value">{progress.xp.toLocaleString()}</p>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="gy-preview-chart">
                  {[40, 60, 45, 70, 55, 80, 50].map((h, i) => (
                    <div key={i} className="gy-preview-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>

                <div className="gy-preview-activity">
                  <p className="gy-preview-activity__label">Recent Activity</p>
                  {[
                    { text: 'Arrays mastered', color: 'var(--gy-primary)' },
                    { text: 'Linked Lists completed', color: 'var(--gy-secondary)' },
                    { text: 'System online', color: 'var(--gy-muted)' },
                  ].map((item, i) => (
                    <div key={i} className="gy-preview-activity__item">
                      <span style={{ color: item.color, fontSize: '0.6rem' }}>◆</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* XP badge like CyberShield's floating badge */}
            <div className="gy-xp-badge">
              <div className="gy-xp-badge__value">{progress.xp.toLocaleString()}</div>
              <div className="gy-xp-badge__label">XP Balance</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards (CyberShield Features section pattern) ── */}
      <section className="gy-features-section">
        <div className="gy-section-center">
          <h2 className="gy-section-title">Core Training Modules</h2>
          <p className="gy-section-sub">Everything you need to crush DSA interviews</p>
        </div>

        <div className="gy-features-grid">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── Quick Stats (only if started) ── */}
      {completedCount > 0 && (
        <section className="gy-stats-section">
          <div className="gy-glass-card">
            <p className="gy-kicker" style={{ marginBottom: '1.5rem' }}>OPERATIONAL STATS</p>
            <div className="gy-stats-grid">
              <StatItem value={progress.xp.toLocaleString()} label="XP Earned" />
              <StatItem value={completedCount} label="Missions Done" />
              <StatItem value={`${pct}%`} label="Campaign Complete" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="gy-feature-card">
      <div className="gy-feature-card__icon" style={{ color }}>{icon}</div>
      <h3 className="gy-feature-card__title" style={{ color }}>{title}</h3>
      <p className="gy-feature-card__desc">{desc}</p>
    </div>
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
