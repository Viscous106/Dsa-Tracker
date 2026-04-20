/**
 * Home.jsx — Landing page
 * Clean, professional layout — no cyber language, no gradients in inline styles.
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../../context';
import { useProgress } from '../../hooks';

export default function Home() {
  const { user } = useAuth();
  const { progress, completedCount, totalLevels, pct, rank } = useProgress();

  const features = [
    { icon: '⚡', title: 'Interactive Challenges', desc: 'Solve 30 real DSA problems with multiple-choice questions, instant feedback, and concept breakdowns.' },
    { icon: '📈', title: 'Progress Tracking',      desc: 'Earn XP for every correct answer. Track your level, rank, and completion rate across all topics.' },
    { icon: '📖', title: 'Cheat Notes',             desc: 'Searchable reference notes for every data structure and algorithm — usage, examples, and key steps.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gy-hero-section">
        <div className="gy-hero-grid">
          <div className="gy-hero-col">
            <span className="gy-hero-eyebrow">DSA Practice Platform</span>

            <h1 className="gy-hero-title">
              Learn algorithms<br />
              <span className="gy-gradient-text">by solving them.</span>
            </h1>

            <p className="gy-hero-sub">
              30 curated challenges covering arrays, trees, graphs, dynamic programming,
              and more. Track your progress, earn XP, and review concepts with built-in notes.
            </p>

            {completedCount > 0 && (
              <div className="gy-hero-progress">
                <div className="gy-hero-progress__labels">
                  <span className="gy-muted">Progress</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
                    {completedCount}/{totalLevels} · {rank}
                  </span>
                </div>
                <div className="gy-progress">
                  <div className="gy-progress__fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}

            <div className="gy-hero-actions">
              <Link className="gy-btn" to="/challenges">
                {completedCount > 0 ? 'Continue' : 'Start practicing'}
              </Link>
              <Link className="gy-btn-ghost" to="/dsa-cheat-notes">
                Cheat notes
              </Link>
            </div>

            {completedCount === 0 && (
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '4px' }}>
                {['30 challenges', 'XP system', 'Cloud sync'].map(t => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--fg-subtle)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: preview card */}
          <div className="gy-hero-preview">
            <div className="gy-preview-card">
              <div className="gy-preview-content">
                <div className="gy-preview-header">
                  <h3>Dashboard</h3>
                  <div className="gy-preview-live">
                    <div className="gy-live-dot" />
                    <span>Live</span>
                  </div>
                </div>

                <div className="gy-preview-stats">
                  <div className="gy-preview-stat">
                    <p className="gy-preview-stat__label">Solved</p>
                    <p className="gy-preview-stat__value">{completedCount}</p>
                  </div>
                  <div className="gy-preview-stat">
                    <p className="gy-preview-stat__label">XP</p>
                    <p className="gy-preview-stat__value">{progress.xp.toLocaleString()}</p>
                  </div>
                </div>

                <div className="gy-preview-chart">
                  {[35, 55, 45, 75, 50, 85, 60].map((h, i) => (
                    <div key={i} className="gy-preview-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>

                <div className="gy-preview-activity">
                  <p className="gy-preview-activity__label">Recent</p>
                  {[
                    'Arrays — completed',
                    'Linked Lists — completed',
                    'Session started',
                  ].map((text, i) => (
                    <div key={i} className="gy-preview-activity__item">
                      <span style={{ color: 'var(--fg-subtle)', fontSize: '8px' }}>●</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="gy-features-section">
        <div className="gy-section-center">
          <h2 className="gy-section-title">How it works</h2>
          <p className="gy-section-sub">
            Each challenge presents a real interview scenario. Pick the right answer,
            review the concept breakdown, and move on.
          </p>
        </div>
        <div className="gy-features-grid">
          {features.map((f, i) => (
            <div key={i} className="gy-feature-card">
              <span className="gy-feature-card__icon">{f.icon}</span>
              <h3 className="gy-feature-card__title">{f.title}</h3>
              <p className="gy-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats (only if started) */}
      {completedCount > 0 && (
        <section className="gy-stats-section">
          <div className="gy-stats-grid">
            <StatItem value={progress.xp.toLocaleString()} label="XP Earned" />
            <StatItem value={`${completedCount} / ${totalLevels}`} label="Solved" />
            <StatItem value={`${pct}%`} label="Complete" />
            <StatItem value={rank} label="Rank" />
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
