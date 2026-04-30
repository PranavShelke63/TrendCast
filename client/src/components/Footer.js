import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-2">
      <div className="container text-center">
        <p className="text-muted">
          &copy; {new Date().getFullYear()} TrendCast. Created by <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>"Pranav Shelke"</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
