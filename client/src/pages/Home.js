import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../features/eventSlice';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Users, Shield, ArrowRight, Zap, Globe, Trophy } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const activeEvents = events.filter(e => e.isActive);
  const totalVolume = events.reduce((sum, e) => sum + (e.totalVotes || 0), 0);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3rem 0 4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.08)', padding: '6px 16px', borderRadius: '20px', marginBottom: '1.5rem' }}>
          <Zap size={14} style={{ color: 'var(--primary-color)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-color)', letterSpacing: '0.03em' }}>INDIA'S PREDICTION MARKETPLACE</span>
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '900', lineHeight: '1.1', maxWidth: '700px', margin: '0 auto 1.25rem', letterSpacing: '-1px' }}>
          Forecast the Future.<br />
          <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn Your Reputation.</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.15rem', maxWidth: '550px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
          Trade predictions on real-world events — elections, crypto, sports, tech — and climb the leaderboard. No real money. Pure skill.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/markets" className="btn" style={{ padding: '0.8rem 2rem', fontSize: '1rem', gap: '0.5rem' }}>
            Explore Markets <ArrowRight size={18} />
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { label: 'Active Markets', value: activeEvents.length, icon: <BarChart3 size={20} /> },
          { label: 'Total Volume', value: `₹${(totalVolume * 142).toLocaleString('en-IN')}`, icon: <TrendingUp size={20} /> },
          { label: 'Total Events', value: events.length, icon: <Globe size={20} /> },
          { label: 'Forecasters', value: `${Math.max(totalVolume, 50)}+`, icon: <Users size={20} /> },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{stat.value}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Trending Markets */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>🔥 Trending Markets</h2>
            <p className="text-muted text-sm">The most active prediction markets right now</p>
          </div>
          <Link to="/markets" className="btn btn-secondary text-sm" style={{ gap: '0.4rem' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <div className="text-center text-muted" style={{ padding: '3rem' }}>Loading markets...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {activeEvents.slice(0, 6).map((event) => (
              <Link key={event._id} to={`/events/${event._id}`} className="card" style={{ textDecoration: 'none', marginBottom: 0, cursor: 'pointer' }}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                    Polymarket
                  </span>
                  <span className="text-success" style={{ fontSize: '0.7rem' }}>● LIVE</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.3', minHeight: '2.6rem' }}>
                  {event.title}
                </h3>
                <div className="flex justify-between items-center" style={{ fontSize: '0.8rem' }}>
                  <span className="text-muted" style={{ fontWeight: '600' }}>{event.totalVotes || 0} predictions</span>
                  <span style={{ fontWeight: '800', color: 'var(--primary-color)' }}>₹{((event.totalVotes || 0) * 142).toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="text-center mb-2">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>How TrendCast Works</h2>
          <p className="text-muted text-sm">Three simple steps to start forecasting</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { step: '01', icon: <Users size={28} />, title: 'Create Account', desc: 'Sign up for free and get a virtual portfolio to start trading predictions.' },
            { step: '02', icon: <BarChart3 size={28} />, title: 'Pick a Market', desc: 'Browse trending events across politics, tech, crypto, sports, and more.' },
            { step: '03', icon: <Trophy size={28} />, title: 'Forecast & Compete', desc: 'Cast your prediction and climb the leaderboard as outcomes resolve.' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', marginBottom: 0 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem', letterSpacing: '0.1em' }}>STEP {item.step}</div>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', borderColor: 'transparent', padding: '3rem', marginBottom: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>
                Built for Serious Forecasters
              </h2>
              <p style={{ opacity: 0.7, marginBottom: '1.5rem', lineHeight: '1.7' }}>
                TrendCast brings institutional-grade prediction analytics to everyone. Real-time sentiment data, community insights, and a competitive leaderboard.
              </p>
              <Link to="/how-it-works" style={{ color: '#60a5fa', fontWeight: '700', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: <Shield size={20} />, title: 'No Real Money', desc: 'Practice with virtual INR' },
                { icon: <Zap size={20} />, title: 'Live Data', desc: 'Powered by Polymarket' },
                { icon: <BarChart3 size={20} />, title: 'Analytics', desc: 'Sentiment tracking' },
                { icon: <Trophy size={20} />, title: 'Compete', desc: 'Global leaderboard' },
              ].map((f, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>{f.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="text-center" style={{ padding: '2rem 0 3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Ready to Start Forecasting?</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Join thousands of forecasters on India's prediction platform.</p>
          <Link to="/register" className="btn" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem' }}>
            Get Started — It's Free
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
