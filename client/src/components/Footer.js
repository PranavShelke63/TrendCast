import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer mt-2">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <TrendingUp size={22} style={{ color: 'var(--primary-color)' }} />
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-color)' }}>TrendCast</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.7', maxWidth: '280px' }}>
              India's prediction marketplace. Forecast real-world events using virtual INR. No real money involved.
            </p>
          </div>

          {/* Markets */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--secondary-color)' }}>Markets</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/markets" className="text-muted" style={{ fontSize: '0.85rem' }}>All Markets</Link>
              <Link to="/categories" className="text-muted" style={{ fontSize: '0.85rem' }}>Explore Categories</Link>
              <Link to="/leaderboard" className="text-muted" style={{ fontSize: '0.85rem' }}>Leaderboard</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--secondary-color)' }}>Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/how-it-works" className="text-muted" style={{ fontSize: '0.85rem' }}>How It Works</Link>
              <Link to="/portfolio" className="text-muted" style={{ fontSize: '0.85rem' }}>Portfolio</Link>
              <Link to="/dashboard" className="text-muted" style={{ fontSize: '0.85rem' }}>Dashboard</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--secondary-color)' }}>About</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>MERN Stack Project</span>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Data: Polymarket API</span>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Currency: INR (Virtual)</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} TrendCast. Created by <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Pranav Shelke</span>
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>
            ⚠️ This is a showcase project. No real money is used.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
