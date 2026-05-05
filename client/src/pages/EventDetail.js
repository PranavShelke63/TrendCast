import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEvent, voteOnEvent } from '../features/eventSlice';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [selectedOption, setSelectedOption] = useState('');
  const [voteMessage, setVoteMessage] = useState('');

  useEffect(() => {
    dispatch(getEvent(id));
  }, [dispatch, id]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    try {
      await dispatch(voteOnEvent({ eventId: id, optionId: selectedOption })).unwrap();
      setVoteMessage('Order executed successfully!');
      dispatch(getEvent(id));
    } catch (err) {
      setVoteMessage(err);
    }
  };

  if (isLoading || !currentEvent) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <div className="text-muted text-center">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p>Loading market details...</p>
        </div>
      </div>
    );
  }

  const { event, votes, totalVotes } = currentEvent;

  // Sentiment Calculation (must be before return)
  const sentimentStats = event.options.map(opt => {
    const voteCount = votes.find(v => v._id === opt.id)?.count || 0;
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    return { ...opt, count: voteCount, percentage };
  });

  const topOption = [...sentimentStats].sort((a, b) => b.count - a.count)[0];

  // Stable mock activity (seeded from event id to avoid rerenders)
  const mockActivity = event.options.length > 0
    ? [1, 2, 3, 4, 5].map(i => ({
        trader: `Bot_Trader_${(parseInt(id.slice(-3), 16) + i * 17) % 100}`,
        option: event.options[(parseInt(id.slice(-2), 16) + i) % event.options.length].text,
        minsAgo: i
      }))
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.2' }}>{event.title}</h1>
          <div className="flex items-center gap-2" style={{ marginTop: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                letterSpacing: '0.08em', padding: '3px 8px', borderRadius: '4px',
                backgroundColor: event.isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: event.isActive ? 'var(--success-color)' : 'var(--error-color)'
              }}
            >
              {event.isActive ? '● Live Market' : '○ Market Resolved'}
            </span>
            <span className="text-muted text-xs">• {totalVotes.toLocaleString()} Predictions</span>
          </div>
        </div>
      </div>

      <p className="text-muted mb-2" style={{ fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
        {event.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>

        {/* Left Column: Trading Interface + Sentiment */}
        <div>
          <div className="card">
            <h2
              className="mb-1 text-sm"
              style={{ textTransform: 'uppercase', fontWeight: '800', color: 'var(--secondary-color)', letterSpacing: '0.05em' }}
            >
              Execute Forecast
            </h2>

            {voteMessage && (
              <div
                className="mb-2 text-sm flex items-center gap-1"
                style={{
                  padding: '0.6rem 1rem', borderRadius: '8px',
                  backgroundColor: voteMessage.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: voteMessage.includes('success') ? 'var(--success-color)' : 'var(--error-color)',
                  border: '1px solid currentColor'
                }}
              >
                <span>{voteMessage.includes('success') ? '✓' : '⚠'}</span>
                <span>{voteMessage}</span>
              </div>
            )}

            {!user ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <p className="text-muted text-sm mb-1">Sign in to participate in this market.</p>
                <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>Login to Trade</button>
              </div>
            ) : !event.isActive ? (
              <div
                className="text-center"
                style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginTop: '1rem' }}
              >
                <p className="text-muted text-sm">
                  Trading halted. Outcome:{' '}
                  <strong style={{ color: 'var(--primary-color)' }}>
                    {event.options.find(o => o.id === event.outcome)?.text || 'Pending'}
                  </strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleVote} style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  {sentimentStats.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'block', padding: '1.25rem',
                        border: `1.5px solid ${selectedOption === option.id ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        borderRadius: '12px', cursor: 'pointer',
                        backgroundColor: selectedOption === option.id ? 'rgba(37, 99, 235, 0.04)' : 'var(--card-bg)',
                        transition: 'all 0.2s ease',
                        position: 'relative', overflow: 'hidden'
                      }}
                    >
                      <input
                        type="radio"
                        name="voteOption"
                        value={option.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        style={{ display: 'none' }}
                      />
                      <div className="flex justify-between items-center">
                        <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{option.text}</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                            {option.percentage}%
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            {option.count} Shares
                          </div>
                        </div>
                      </div>
                      {/* Sentiment fill bar at bottom */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, height: '3px',
                        width: `${option.percentage}%`,
                        backgroundColor: 'var(--primary-color)', opacity: 0.5,
                        transition: 'width 1s ease-out'
                      }} />
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
                  disabled={!selectedOption || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Forecast'}
                </button>
              </form>
            )}
          </div>

          {/* Community Sentiment Bars */}
          <div className="card">
            <h2
              className="mb-1 text-sm"
              style={{ textTransform: 'uppercase', fontWeight: '800', color: 'var(--secondary-color)', letterSpacing: '0.05em' }}
            >
              Community Sentiment
            </h2>
            <div style={{ marginTop: '1rem' }}>
              {sentimentStats.map(stat => {
                const barColor = stat.id === 'yes'
                  ? 'var(--success-color)'
                  : stat.id === 'no'
                  ? 'var(--error-color)'
                  : 'var(--primary-color)';
                return (
                  <div key={stat.id} style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between" style={{ marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: '700' }}>
                      <span>{stat.text}</span>
                      <span>{stat.percentage}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${stat.percentage}%`,
                        backgroundColor: barColor,
                        transition: 'width 1s ease-in-out'
                      }} />
                    </div>
                  </div>
                );
              })}
              {totalVotes === 0 && (
                <p className="text-center text-muted text-sm" style={{ padding: '1rem 0' }}>No forecasts yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity + Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Activity */}
          <div className="card">
            <h2
              className="mb-1 text-sm"
              style={{ textTransform: 'uppercase', fontWeight: '800', color: 'var(--secondary-color)', letterSpacing: '0.05em' }}
            >
              Live Activity
            </h2>
            <div style={{ marginTop: '1rem' }}>
              {totalVotes > 0 ? (
                <div>
                  {mockActivity.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center"
                      style={{
                        gap: '0.75rem', padding: '0.6rem 0',
                        borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none'
                      }}
                    >
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: 'var(--success-color)', flexShrink: 0
                      }} />
                      <div style={{ flex: 1, fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: '700' }}>{activity.trader}</span>
                        <span className="text-muted"> predicted </span>
                        <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>{activity.option}</span>
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.75rem', flexShrink: 0 }}>
                        {activity.minsAgo}m ago
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted text-sm" style={{ padding: '1.5rem 0' }}>
                  Waiting for first forecast...
                </p>
              )}
            </div>
          </div>

          {/* Market Insights Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              borderColor: 'transparent', color: 'white'
            }}
          >
            <h2 className="mb-1 text-sm" style={{ fontWeight: '800', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Market Insights
            </h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '1rem', lineHeight: '1.5' }}>
              Community consensus is currently leaning towards{' '}
              <strong>{topOption?.text || '—'}</strong>.
              High activity detected in the last 24 hours.
            </p>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                VOL: ₹{(totalVotes * 142).toLocaleString('en-IN')}
              </span>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                LIQ: High
              </span>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="card">
            <h2
              className="mb-1 text-sm"
              style={{ textTransform: 'uppercase', fontWeight: '800', color: 'var(--secondary-color)', letterSpacing: '0.05em' }}
            >
              Stats
            </h2>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm">Total Forecasts</span>
                <span style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{totalVotes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm">Options</span>
                <span style={{ fontWeight: '800' }}>{event.options.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm">Status</span>
                <span style={{ fontWeight: '700', color: event.isActive ? 'var(--success-color)' : 'var(--error-color)' }}>
                  {event.isActive ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetail;
