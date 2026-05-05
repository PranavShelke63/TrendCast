import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Target } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Simulated leaderboard data with INR
        setUsers([
          { username: 'crypto_whale', points: 42500, winRate: '68%', totalTrades: 156, pnl: 12400, badges: ['🐋 Whale', '🏆 Top 1%'] },
          { username: 'predict_master', points: 31200, winRate: '62%', totalTrades: 134, pnl: 8200, badges: ['🎯 Expert'] },
          { username: 'market_guru_23', points: 28000, winRate: '59%', totalTrades: 112, pnl: 6800, badges: ['📈 Analyst'] },
          { username: 'future_seer', points: 19500, winRate: '55%', totalTrades: 89, pnl: 4200, badges: [] },
          { username: 'data_ninja', points: 17200, winRate: '53%', totalTrades: 78, pnl: 3100, badges: [] },
          { username: 'trend_hunter', points: 15800, winRate: '51%', totalTrades: 67, pnl: 2400, badges: [] },
          { username: 'alpha_trader', points: 12400, winRate: '49%', totalTrades: 54, pnl: 1200, badges: [] },
          { username: 'quant_mind', points: 11000, winRate: '48%', totalTrades: 48, pnl: 800, badges: [] },
          { username: 'signal_king', points: 9200, winRate: '47%', totalTrades: 41, pnl: 400, badges: [] },
          { username: 'momentum_pro', points: 7800, winRate: '45%', totalTrades: 35, pnl: -200, badges: [] },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center" style={{ padding: '5rem 0' }}><p className="text-muted">Loading leaderboard...</p></div>;

  // Stats from data
  const totalForecasters = users.length;
  const totalPoints = users.reduce((s, u) => s + u.points, 0);
  const avgWinRate = Math.round(users.reduce((s, u) => s + parseInt(u.winRate), 0) / users.length);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={28} style={{ color: '#fbbf24' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: '900' }}>Global Leaderboard</h1>
          </div>
          <p className="text-muted text-sm">Top forecasters ranked by prediction accuracy and total points earned.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'week', 'month'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid',
                borderColor: timeframe === tf ? 'var(--primary-color)' : 'var(--border-color)',
                backgroundColor: timeframe === tf ? 'rgba(37, 99, 235, 0.08)' : 'white',
                color: timeframe === tf ? 'var(--primary-color)' : 'var(--secondary-color)',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', textTransform: 'capitalize'
              }}
            >
              {tf === 'all' ? 'All Time' : `This ${tf}`}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <Users size={18} style={{ color: 'var(--primary-color)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalForecasters}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Forecasters</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <Target size={18} style={{ color: '#059669', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{avgWinRate}%</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Avg Win Rate</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <TrendingUp size={18} style={{ color: '#d97706', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹{(totalPoints * 10).toLocaleString('en-IN')}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Volume</div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {users.slice(0, 3).map((u, idx) => {
          const colors = ['#fbbf24', '#94a3b8', '#b45309'];
          const positions = ['1st', '2nd', '3rd'];
          return (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1.75rem 1.5rem', marginBottom: 0, borderTop: `3px solid ${colors[idx]}` }}>
              <Medal size={32} color={colors[idx]} fill={colors[idx]} style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: colors[idx], textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{positions[idx]} Place</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.25rem' }}>{u.username}</div>
              <div className="flex items-center justify-center gap-1" style={{ marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {u.badges.map(badge => (
                  <span key={badge} style={{ fontSize: '0.6rem', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    {badge}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
                {u.points.toLocaleString('en-IN')}
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>points</div>
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{u.winRate}</div>
                  <div className="text-muted">Win Rate</div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: u.pnl >= 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
                    {u.pnl >= 0 ? '+' : ''}₹{u.pnl.toLocaleString('en-IN')}
                  </div>
                  <div className="text-muted">P&L</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Rank</th>
              <th>Forecaster</th>
              <th>Win Rate</th>
              <th>Trades</th>
              <th>P&L</th>
              <th style={{ textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={idx} style={{ transition: 'background-color 0.2s' }}>
                <td style={{ textAlign: 'center' }}>
                  {idx === 0 ? <Medal size={20} color="#fbbf24" fill="#fbbf24" /> :
                   idx === 1 ? <Medal size={20} color="#94a3b8" fill="#94a3b8" /> :
                   idx === 2 ? <Medal size={20} color="#b45309" fill="#b45309" /> :
                   <span style={{ fontWeight: '700', color: 'var(--secondary-color)' }}>{idx + 1}</span>}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: '700' }}>{u.username}</span>
                    {u.badges.map(badge => (
                      <span key={badge} style={{ fontSize: '0.6rem', backgroundColor: '#e2e8f0', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Star size={12} color="#10b981" />
                    <span style={{ fontWeight: '600' }}>{u.winRate}</span>
                  </div>
                </td>
                <td style={{ fontWeight: '500' }}>{u.totalTrades}</td>
                <td>
                  <span style={{ fontWeight: '700', color: u.pnl >= 0 ? 'var(--success-color)' : 'var(--error-color)' }}>
                    {u.pnl >= 0 ? '+' : ''}₹{u.pnl.toLocaleString('en-IN')}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.05rem' }}>{u.points.toLocaleString('en-IN')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center" style={{ marginTop: '1.5rem' }}>
        <p className="text-muted text-sm">Leaderboard updates every 24 hours. Points are based on prediction accuracy.</p>
      </div>
    </div>
  );
};

export default Leaderboard;
