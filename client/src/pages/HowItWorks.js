import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, Shield, Zap, Target, Award, ArrowRight, HelpCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div>
      {/* Hero */}
      <section className="text-center" style={{ padding: '2rem 0 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
          How TrendCast Works
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
          TrendCast is a prediction marketplace where you forecast real-world events using virtual INR. No real money involved — just skill, strategy, and bragging rights.
        </p>
      </section>

      {/* Steps */}
      <section style={{ marginBottom: '3rem' }}>
        {[
          {
            step: '1',
            icon: <Users size={32} />,
            title: 'Create Your Account',
            desc: 'Sign up for free in seconds. You\'ll receive a virtual portfolio of ₹10,000 to start trading predictions immediately.',
            color: '#2563eb'
          },
          {
            step: '2',
            icon: <BarChart3 size={32} />,
            title: 'Browse Prediction Markets',
            desc: 'Explore active markets across categories — Politics, Crypto, Tech, Sports, Entertainment, and more. Each market is sourced from real Polymarket data.',
            color: '#7c3aed'
          },
          {
            step: '3',
            icon: <Target size={32} />,
            title: 'Make Your Forecast',
            desc: 'Pick a side on any market (Yes/No, or multiple outcomes). Your prediction is recorded and tracked in your personal dashboard.',
            color: '#059669'
          },
          {
            step: '4',
            icon: <Award size={32} />,
            title: 'Earn Points & Climb Rankings',
            desc: 'When a market resolves, correct predictions earn you points. The more accurate you are, the higher you rank on the global leaderboard.',
            color: '#d97706'
          }
        ].map((item, i) => (
          <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', alignItems: 'center', padding: '2rem', marginBottom: '1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              backgroundColor: `${item.color}10`, color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: item.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                Step {item.step}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p className="text-muted" style={{ lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Key Features */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Platform Features</h2>
        <p className="text-center text-muted text-sm mb-2">Everything you need to forecast like a pro</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { icon: <Shield size={24} />, title: 'Zero Risk', desc: 'Trade with virtual INR. No real money, no payment gateway. Pure skill-based forecasting.' },
            { icon: <Zap size={24} />, title: 'Live Polymarket Data', desc: 'Markets are synced from Polymarket Gamma API. Real events, real questions, real outcomes.' },
            { icon: <TrendingUp size={24} />, title: 'Sentiment Analytics', desc: 'See how the community is voting with real-time sentiment bars and confidence scores.' },
            { icon: <Users size={24} />, title: 'Community Driven', desc: 'Join a community of forecasters. See live activity feeds and discover trending markets.' },
            { icon: <Award size={24} />, title: 'Leaderboard', desc: 'Compete for the top spot. Points are awarded for accurate predictions across all markets.' },
            { icon: <BarChart3 size={24} />, title: 'Portfolio Tracking', desc: 'Track all your predictions in your personal dashboard with detailed history and win rates.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '1.75rem', marginBottom: 0 }}>
              <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
        <h2 className="text-center" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          <HelpCircle size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted text-sm mb-2">Quick answers to common questions</p>
        {[
          { q: 'Is this real money trading?', a: 'No! TrendCast is a showcase/educational platform. All trading uses virtual INR (₹). There is no payment gateway or real financial risk involved.' },
          { q: 'Where does the market data come from?', a: 'Our markets are sourced from Polymarket\'s Gamma API — a real-world prediction marketplace. We display their questions and let our community forecast outcomes independently.' },
          { q: 'How are points calculated?', a: 'You earn points when a market resolves and your prediction matches the outcome. The earlier you predicted correctly, the more points you earn.' },
          { q: 'Can I create my own markets?', a: 'Currently, only admins can create and manage markets. Community-created markets are on our roadmap.' },
          { q: 'Is this available on mobile?', a: 'Yes! TrendCast is fully responsive and works on all devices — desktop, tablet, and mobile.' },
        ].map((faq, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{faq.q}</h4>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center" style={{ padding: '2rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Start Forecasting Today</h2>
        <p className="text-muted mb-2">No real money. No risk. Just predictions.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/markets" className="btn" style={{ padding: '0.75rem 2rem', gap: '0.5rem' }}>
            Browse Markets <ArrowRight size={16} />
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
