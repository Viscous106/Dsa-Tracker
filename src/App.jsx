import { Suspense, lazy, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import Loading from './components/common/Loading/Loading';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import { useAuth } from './context';

const Home = lazy(() => import('./pages/Home/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Learn = lazy(() => import('./pages/Learn/Learn'));
const CheatNotes = lazy(() => import('./pages/CheatNotes/CheatNotes'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ChallengeRunner = lazy(() => import('./pages/Challenge/Challenge'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function Private({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="gy-app">
      {/* ── Fixed Navbar (CyberShield style) ── */}
      {user && (
        <nav className="gy-navbar">
          <div className="gy-navbar__inner">
            {/* Logo */}
            <Link className="gy-brand" to="/">
              <div className="gy-brand-badge">DV</div>
              <span>DSA Veda</span>
            </Link>

            {/* Desktop nav links */}
            <div className="gy-navbar__links">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/challenges">Challenges</NavLink>
              <NavLink to="/dsa-cheat-notes">Cheat Notes</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </div>

            {/* Right CTA */}
            <div className="gy-navbar__right">
              <button className="gy-btn" onClick={logout} type="button">
                Logout
              </button>
            </div>

            {/* Mobile burger */}
            <button
              className="gy-navbar__burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="gy-navbar__mobile">
              <NavLink to="/" end onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              <NavLink to="/challenges" onClick={() => setMobileOpen(false)}>Challenges</NavLink>
              <NavLink to="/dsa-cheat-notes" onClick={() => setMobileOpen(false)}>Cheat Notes</NavLink>
              <NavLink to="/profile" onClick={() => setMobileOpen(false)}>Profile</NavLink>
              <button className="gy-btn" onClick={() => { logout(); setMobileOpen(false); }} type="button" style={{ width: '100%', marginTop: '0.5rem' }}>
                Logout
              </button>
            </div>
          )}
        </nav>
      )}

      {/* ── Page content ── */}
      <main className={user ? 'gy-main--with-nav' : 'gy-main'}>
        {/* Background orbs like CyberShield */}
        <div className="gy-bg-orbs" aria-hidden="true" />

        <div className="gy-page-wrap">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              <Route path="/" element={<Private><Home /></Private>} />
              <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
              <Route path="/challenges" element={<Private><Learn /></Private>} />
              <Route path="/dsa-cheat-notes" element={<Private><CheatNotes /></Private>} />
              <Route path="/profile" element={<Private><Profile /></Private>} />
              <Route path="/challenge/:id" element={<Private><ChallengeRunner /></Private>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
