import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowRight, Target } from 'lucide-react';

const Portfolio = () => {
  const { user } = useSelector((state) => state.auth);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`/api/users/${user._id}/activity`);
        setActivity(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <Wallet size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Sign in to View Your Portfolio</h2>
        <p className="text-muted mb-2">Track all your predictions and performance in one place.</p>
        <Link to="/login" className="btn" style={{ padding: '0.75rem 2rem' }}>Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '5rem 0' }}>
        <p className="text-muted">Loading portfolio...</p>
      </div>
    );
  }

  // Compute portfolio stats
  const totalPredictions = activity.length;
  const openPredictions = activity.filter(a => a.event?.isActive).length;
  const closedPredictions = activity.filter(a => a.event && !a.event.isActive).length;
  const correctPredictions = activity.filter(a => {
    if (!a.event || a.event.isActive) return false;
    return a.event.outcome === a.optionId;
  }).length;
  const winRate = closedPredictions > 0 ? Math.round((correctPredictions / closedPredictions) * 100) : 0;
  const virtualBalance = 10000 + (correctPredictions * 500) - (closedPredictions - correctPredictions) * 200;
  const pnl = virtualBalance - 10000;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem' }}>My Portfolio</h1>
        <p className="text-muted">Track your predictions, performance, and virtual balance.</p>
      </div>

      {/* Balance Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white', borderColor: 'transparent', padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>Virtual Balance</div>
            <div style={{ fontSize: '2rem', fontWeight: '900' }}>₹{virtualBalance.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: pnl >= 0 ? '#34d399' : '#f87171' }}>
              {pnl >= 0 ? '↑' : '↓'} ₹{Math.abs(pnl).toLocaleString('en-IN')} ({pnl >= 0 ? '+' : ''}{((pnl / 10000) * 100).toFixed(1)}%)
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>Win Rate</div>
            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{winRate}%</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.6 }}>{correctPredictions}/{closedPredictions} correct</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '0.5rem' }}>Total Predictions</div>
            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{totalPredictions}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.6 }}>{openPredictions} open · {closedPredictions} resolved</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <Target size={20} style={{ color: 'var(--primary-color)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{totalPredictions}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Predictions</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <TrendingUp size={20} style={{ color: 'var(--success-color)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success-color)' }}>{correctPredictions}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Correct</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <TrendingDown size={20} style={{ color: 'var(--error-color)', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--error-color)' }}>{closedPredictions - correctPredictions}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Wrong</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem', marginBottom: 0 }}>
          <PieChart size={20} style={{ color: '#7c3aed', margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#7c3aed' }}>{openPredictions}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>Pending</div>
        </div>
      </div>

      {/* Prediction History */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>Prediction History</h2>
        {activity.length > 0 ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Your Forecast</th>
                  <th>Staked</th>
                  <th>Date</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => {
                  const isOpen = item.event?.isActive;
                  const isCorrect = !isOpen && item.event?.outcome === item.optionId;
                  return (
                    <tr key={item._id}>
                      <td>
                        <Link to={`/events/${item.event?._id}`} style={{ color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem' }}>
                          {item.event?.title?.substring(0, 50)}{item.event?.title?.length > 50 ? '...' : ''}
                        </Link>
                      </td>
                      <td style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                        {item.event?.options?.find(opt => opt.id === item.optionId)?.text || item.optionId}
                      </td>
                      <td style={{ fontWeight: '600' }}>₹500</td>
                      <td className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        {isOpen ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '4px' }}>PENDING</span>
                        ) : isCorrect ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '4px' }}>+₹500 WON</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px' }}>-₹200 LOST</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Wallet size={32} className="text-muted" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>No Predictions Yet</h3>
            <p className="text-muted text-sm mb-2">Start forecasting on active markets to build your portfolio.</p>
            <Link to="/markets" className="btn" style={{ gap: '0.5rem' }}>
              Browse Markets <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
