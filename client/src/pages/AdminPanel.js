import React, { useState } from 'react';
import axios from 'axios';
import AdminEvents from '../components/admin/AdminEvents';
import AdminUsers from '../components/admin/AdminUsers';
import AdminVotes from '../components/admin/AdminVotes';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const options = [
        { id: 'opt1', text: option1 },
        { id: 'opt2', text: option2 }
      ];
      await axios.post('/api/admin/events', { title, description, options });
      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setOption1('');
      setOption2('');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleSyncPolymarket = async () => {
    try {
      setMessage('Syncing with Polymarket...');
      const res = await axios.post('/api/admin/sync-polymarket');
      setMessage(`${res.data.message} (${res.data.syncedCount} new events)`);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handleSeedActivity = async () => {
    try {
      setMessage('Seeding mock activity...');
      const res = await axios.post('/api/admin/seed-activity');
      setMessage(`${res.data.message} (${res.data.totalVotesSeeded} votes added across ${res.data.eventsAffected} events)`);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1 className="mb-2">Admin Terminal</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button className={`btn ${activeTab === 'overview' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn ${activeTab === 'events' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('events')}>Events</button>
        <button className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`btn ${activeTab === 'votes' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('votes')}>Votes</button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card">
              <h2 className="mb-1 text-sm">Polymarket Integration</h2>
              <p className="text-muted mb-2 text-sm">Fetch active prediction markets directly from Polymarket Gamma API.</p>
              <button className="btn btn-secondary w-full" onClick={handleSyncPolymarket}>Sync Markets</button>
            </div>

            <div className="card">
              <h2 className="mb-1 text-sm">Activity Simulator</h2>
              <p className="text-muted mb-2 text-sm">Populate the platform with simulated trades from AI bot accounts.</p>
              <button className="btn btn-secondary w-full" onClick={handleSeedActivity}>Seed Activity</button>
            </div>
          </div>

          <div className="card" style={{ maxWidth: '600px' }}>
            <h2 className="mb-1 text-sm">Create Custom Event</h2>
            {message && <p className="mb-1" style={{ color: message.includes('success') ? 'var(--success-color)' : 'var(--error-color)' }}>{message}</p>}
            
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" />
              </div>
              <div className="form-group">
                <label>Option 1</label>
                <input value={option1} onChange={(e) => setOption1(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Option 2</label>
                <input value={option2} onChange={(e) => setOption2(e.target.value)} required />
              </div>
              <button type="submit" className="btn">Create Event</button>
            </form>
          </div>
        </>
      )}

      {activeTab === 'events' && <AdminEvents />}
      {activeTab === 'users' && <AdminUsers />}
      {activeTab === 'votes' && <AdminVotes />}
    </div>
  );
};

export default AdminPanel;
