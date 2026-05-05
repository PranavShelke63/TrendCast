import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/authSlice';
import { TrendingUp } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar container">
      <div className="flex items-center">
        <Link to="/" className="logo flex items-center gap-2" style={{ marginRight: '2.5rem' }}>
          <TrendingUp size={28} />
          <span style={{ letterSpacing: '-0.5px' }}>TrendCast</span>
        </Link>
        <div className="flex gap-1">
          <Link
            to="/markets"
            className={`nav-link ${isActive('/markets') ? 'active' : ''}`}
          >
            Markets
          </Link>
          <Link
            to="/categories"
            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
          >
            Explore
          </Link>
          <Link
            to="/leaderboard"
            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          >
            Leaderboard
          </Link>
          <Link
            to="/how-it-works"
            className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
          >
            How It Works
          </Link>
        </div>
      </div>
      
      <div className="nav-links">
        {user ? (
          <div className="flex items-center gap-1">
            <Link
              to="/portfolio"
              className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}
            >
              Portfolio
            </Link>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                Admin
              </Link>
            )}
            <button className="btn btn-secondary text-sm" onClick={onLogout} style={{ marginLeft: '0.5rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn text-sm" style={{ marginLeft: '0.5rem' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
