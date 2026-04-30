import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
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

  const handleFetchLiveData = async () => {
    try {
      setMessage('Fetching live data...');
      const res = await axios.post('/api/admin/fetch-live-data');
      setMessage(res.data.message + ` (${res.data.count} events created)`);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1 className="mb-2">Admin Panel</h1>
      
      <div className="card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <h2 className="mb-1 text-sm">Automated Market Creation</h2>
        <p className="text-muted mb-2 text-sm">Fetch live Polymarket data to instantly populate new prediction markets.</p>
        <button className="btn btn-secondary" onClick={handleFetchLiveData}>Sync Polymarket Data</button>
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
    </div>
  );
};

export default AdminPanel;
