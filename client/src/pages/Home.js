import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../features/eventSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { events, isLoading, isError, message } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-center mt-2">Loading events...</div>;
  }

  if (isError) {
    return <div className="text-center mt-2 text-error">{message}</div>;
  }

  return (
    <div>
      <h1 className="mb-2">Active Predictions</h1>
      {events.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {events.map((event) => (
            <div key={event._id} className="card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.title}</h2>
              <p className="text-muted text-sm mb-1">{event.description.substring(0, 100)}...</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${event.isActive ? 'text-success' : 'text-error'}`}>
                  {event.isActive ? 'Active' : 'Closed'}
                </span>
                <Link to={`/events/${event._id}`} className="btn text-sm">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No active events available at the moment.</p>
      )}
    </div>
  );
};

export default Home;
