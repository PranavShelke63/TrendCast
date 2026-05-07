import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../features/eventSlice';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const Markets = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const filteredEvents = events.filter((e) => {
    if (filter === 'active' && !e.isActive) return false;
    if (filter === 'closed' && e.isActive) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>Prediction Markets</h1>
          <p className="text-muted">Discover trending markets and cast your predictions.</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          <div className="form-group flex items-center" style={{ margin: 0, position: 'relative' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px' }} />
            <input 
              type="text" 
              placeholder="Search markets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '280px', paddingLeft: '40px' }}
            />
          </div>
          <div className="form-group flex items-center" style={{ margin: 0 }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ paddingRight: '2.5rem' }}>
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="closed">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center mt-2">
          <div className="text-muted">Loading markets...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filteredEvents.map((event) => (
            <div key={event._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex gap-1">
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
                    Polymarket
                  </span>
                  {event.totalVotes > 5 && (
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: '#fff7ed', padding: '2px 6px', borderRadius: '4px', color: '#c2410c', textTransform: 'uppercase' }}>
                      🔥 Trending
                    </span>
                  )}
                </div>
                <span className={`text-xs font-bold ${event.isActive ? 'text-success' : 'text-error'}`}>
                  {event.isActive ? '● ACTIVE' : 'RESOLVED'}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: '800', minHeight: '3rem', lineHeight: '1.3' }}>
                {event.title}
              </h2>
              
              <p className="text-muted text-xs mb-2" style={{ flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {event.description}
              </p>
              
              <div className="mt-1 flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-muted uppercase tracking-wider">Volume</span>
                <span className="text-primary">{event.totalVotes || 0} Predictions · ₹{((event.totalVotes || 0) * 142).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                <Link to={`/events/${event._id}`} className="btn w-full" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                  Forecast Now <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="card text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
              <h3 className="mb-1">No markets found</h3>
              <p className="text-muted">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Markets;
