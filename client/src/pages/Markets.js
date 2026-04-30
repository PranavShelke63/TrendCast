import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../features/eventSlice';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';

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
                <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: 'var(--secondary-color)' }}>
                  CRYPTO
                </span>
                <span className={`text-sm ${event.isActive ? 'text-success' : 'text-error'}`}>
                  {event.isActive ? '● Active' : 'Resolved'}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '700', minHeight: '3.5rem' }}>
                {event.title}
              </h2>
              
              <p className="text-muted text-sm mb-2" style={{ flex: 1 }}>
                {event.description.substring(0, 140)}...
              </p>
              
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                <Link to={`/events/${event._id}`} className="btn" style={{ width: '100%', gap: '0.5rem' }}>
                  View Market <ArrowRight size={16} />
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
