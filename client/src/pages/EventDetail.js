import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEvent, voteOnEvent } from '../features/eventSlice';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

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
      dispatch(getEvent(id)); // refresh stats
    } catch (err) {
      setVoteMessage(err);
    }
  };

  if (isLoading || !currentEvent) {
    return <div className="text-center mt-2">Loading market details...</div>;
  }

  const { event, votes, totalVotes } = currentEvent;

  const chartData = {
    labels: event.options.map(opt => opt.text),
    datasets: [{
      data: event.options.map(opt => {
        const voteCount = votes.find(v => v._id === opt.id)?.count || 0;
        return voteCount;
      }),
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1>{event.title}</h1>
        <span className={`text-sm font-semibold ${event.isActive ? 'text-success' : 'text-error'}`} style={{ padding: '0.4rem 0.8rem', backgroundColor: event.isActive ? '#d1fae5' : '#fee2e2', borderRadius: '4px' }}>
          {event.isActive ? 'MARKET OPEN' : 'MARKET CLOSED'}
        </span>
      </div>
      <p className="text-muted mb-2" style={{ fontSize: '1.1rem' }}>{event.description}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Trading Interface */}
        <div className="card">
          <h2 className="mb-1 text-sm" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Book / Trade</h2>
          {voteMessage && <p className="mb-1 text-sm" style={{ padding: '0.5rem', backgroundColor: voteMessage.includes('success') ? '#d1fae5' : '#fee2e2', color: voteMessage.includes('success') ? '#065f46' : '#991b1b', borderRadius: '4px' }}>{voteMessage}</p>}
          
          {!user ? (
            <p className="text-muted text-sm mt-2">Please log in to trade on this market.</p>
          ) : !event.isActive ? (
            <p className="text-muted text-sm mt-2">Trading halted. Market is closed.</p>
          ) : (
            <form onSubmit={handleVote} style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {event.options.map((option) => (
                  <label key={option.id} style={{
                    display: 'block', padding: '1rem', border: '1px solid',
                    borderColor: selectedOption === option.id ? 'var(--primary-color)' : 'var(--border-color)',
                    borderRadius: '8px', cursor: 'pointer',
                    backgroundColor: selectedOption === option.id ? '#eff6ff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="voteOption"
                      value={option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div className="flex justify-between items-center">
                      <span style={{ fontWeight: '600' }}>{option.text}</span>
                      <span className="text-muted text-sm">{votes.find(v => v._id === option.id)?.count || 0} Shares</span>
                    </div>
                  </label>
                ))}
              </div>
              <button type="submit" className="btn" style={{ width: '100%', padding: '0.8rem' }} disabled={!selectedOption}>
                Execute Order
              </button>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="card flex items-center justify-center">
          <div style={{ width: '100%' }}>
            <h2 className="text-center text-sm mb-2">Market Liquidity (Total: {totalVotes})</h2>
            {totalVotes > 0 ? (
              <div style={{ maxWidth: '250px', margin: '0 auto' }}>
                <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            ) : (
              <p className="text-center text-muted">No liquidity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
