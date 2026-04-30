import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setUsers([
          { username: 'crypto_whale', points: 4250, winRate: '68%', badges: ['Whale', 'Top 1%'] },
          { username: 'predict_master', points: 3120, winRate: '62%', badges: ['Expert'] },
          { username: 'john_doe', points: 2800, winRate: '55%', badges: [] },
          { username: 'jane_smith', points: 1950, winRate: '51%', badges: [] },
          { username: 'future_seer', points: 1200, winRate: '48%', badges: [] }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center mt-2">Loading leaderboard...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={32} className="text-success" style={{ color: '#fbbf24' }} />
        <h1 style={{ fontSize: '2rem' }}>Global Leaderboard</h1>
      </div>
      <p className="text-muted mb-2">Top performers based on prediction accuracy and total points earned.</p>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-md)' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Forecaster</th>
              <th>Win Rate</th>
              <th style={{ textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={idx} style={{ transition: 'background-color 0.2s' }}>
                <td style={{ textAlign: 'center' }}>
                  {idx === 0 ? <Medal size={24} color="#fbbf24" fill="#fbbf24" /> : 
                   idx === 1 ? <Medal size={24} color="#94a3b8" fill="#94a3b8" /> : 
                   idx === 2 ? <Medal size={24} color="#b45309" fill="#b45309" /> : 
                   <span style={{ fontWeight: '700', color: 'var(--secondary-color)' }}>{idx + 1}</span>}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: '600' }}>{u.username}</span>
                    {u.badges.map(badge => (
                      <span key={badge} style={{ fontSize: '0.65rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Star size={14} color="#10b981" />
                    <span style={{ fontWeight: '500' }}>{u.winRate}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{u.points.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-muted text-sm">Leaderboard updates every 24 hours.</p>
      </div>
    </div>
  );
};

export default Leaderboard;
