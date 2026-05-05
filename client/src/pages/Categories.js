import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../features/eventSlice';
import { BarChart3, Globe, Cpu, Trophy as TrophyIcon, Film, Landmark, Flame, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Markets', icon: <Globe size={18} />, color: '#2563eb' },
  { id: 'politics', label: 'Politics', icon: <Landmark size={18} />, color: '#dc2626', keywords: ['election', 'president', 'vote', 'congress', 'senate', 'governor', 'political', 'trump', 'biden', 'modi', 'party', 'democrat', 'republican'] },
  { id: 'crypto', label: 'Crypto & Finance', icon: <BarChart3 size={18} />, color: '#f59e0b', keywords: ['bitcoin', 'btc', 'ethereum', 'crypto', 'fed', 'interest rate', 'stock', 'market cap', 'finance', 'inflation', 'gdp', 'recession', 'bank', 'dollar', 'rupee'] },
  { id: 'tech', label: 'Technology', icon: <Cpu size={18} />, color: '#7c3aed', keywords: ['ai', 'gpt', 'openai', 'google', 'apple', 'meta', 'tesla', 'spacex', 'launch', 'release', 'tech', 'software', 'chip', 'quantum'] },
  { id: 'sports', label: 'Sports', icon: <TrophyIcon size={18} />, color: '#059669', keywords: ['world cup', 'nba', 'nfl', 'cricket', 'ipl', 'fifa', 'olympics', 'championship', 'match', 'game', 'win', 'league', 'team'] },
  { id: 'entertainment', label: 'Entertainment', icon: <Film size={18} />, color: '#ec4899', keywords: ['oscar', 'movie', 'album', 'grammy', 'show', 'series', 'netflix', 'spotify', 'music', 'award', 'celebrity'] },
];

const Categories = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const categorizeEvent = (event) => {
    const text = (event.title + ' ' + event.description).toLowerCase();
    for (const cat of CATEGORIES) {
      if (cat.id === 'all') continue;
      if (cat.keywords && cat.keywords.some(kw => text.includes(kw))) {
        return cat.id;
      }
    }
    return 'other';
  };

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => categorizeEvent(e) === activeCategory);

  // Count events per category
  const categoryCounts = {};
  events.forEach(e => {
    const cat = categorizeEvent(e);
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  categoryCounts['all'] = events.length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem' }}>Explore Categories</h1>
        <p className="text-muted">Browse prediction markets by topic area</p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.25rem', borderRadius: '24px', border: '1.5px solid',
              borderColor: activeCategory === cat.id ? cat.color : 'var(--border-color)',
              backgroundColor: activeCategory === cat.id ? `${cat.color}10` : 'white',
              color: activeCategory === cat.id ? cat.color : 'var(--text-color)',
              cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.icon}
            {cat.label}
            <span style={{
              backgroundColor: activeCategory === cat.id ? cat.color : '#e2e8f0',
              color: activeCategory === cat.id ? 'white' : 'var(--secondary-color)',
              fontSize: '0.7rem', fontWeight: '700', padding: '1px 6px', borderRadius: '10px',
              minWidth: '20px', textAlign: 'center'
            }}>
              {categoryCounts[cat.id] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center text-muted" style={{ padding: '4rem' }}>Loading markets...</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filteredEvents.map((event) => {
            const cat = CATEGORIES.find(c => c.id === categorizeEvent(event)) || CATEGORIES[0];
            return (
              <Link key={event._id} to={`/events/${event._id}`} className="card" style={{ textDecoration: 'none', marginBottom: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: `${cat.color}10`, padding: '2px 6px', borderRadius: '4px', color: cat.color, textTransform: 'uppercase' }}>
                      {cat.label}
                    </span>
                    {(event.totalVotes || 0) > 5 && (
                      <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: '#fff7ed', padding: '2px 6px', borderRadius: '4px', color: '#c2410c' }}>
                        <Flame size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> HOT
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: event.isActive ? 'var(--success-color)' : 'var(--error-color)' }}>
                    {event.isActive ? '● ACTIVE' : 'RESOLVED'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.35', flex: 1 }}>
                  {event.title}
                </h3>
                <div className="flex justify-between items-center" style={{ fontSize: '0.8rem' }}>
                  <span className="text-muted" style={{ fontWeight: '600' }}>{event.totalVotes || 0} predictions</span>
                  <span style={{ fontWeight: '800', color: 'var(--primary-color)' }}>₹{((event.totalVotes || 0) * 142).toLocaleString('en-IN')}</span>
                </div>
              </Link>
            );
          })}
          {filteredEvents.length === 0 && (
            <div className="card text-center" style={{ gridColumn: '1 / -1', padding: '4rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>No markets in this category</h3>
              <p className="text-muted text-sm">Try selecting a different category or sync more markets from the admin panel.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
