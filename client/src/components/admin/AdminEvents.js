import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', category: '', isActive: true });

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/admin/events');
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/admin/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (event) => {
    setEditingId(event._id);
    setEditFormData({ title: event.title, category: event.category || '', isActive: event.isActive });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await axios.put(`/api/admin/events/${id}`, editFormData);
      setEvents(events.map(event => event._id === id ? res.data : event));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2 className="mb-1 text-sm">Manage Events</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.5rem' }}>Title</th>
              <th style={{ padding: '0.5rem' }}>Category</th>
              <th style={{ padding: '0.5rem' }}>Active</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {editingId === event._id ? (
                  <>
                    <td style={{ padding: '0.5rem' }}><input name="title" value={editFormData.title} onChange={handleEditChange} style={{width: '100%'}}/></td>
                    <td style={{ padding: '0.5rem' }}><input name="category" value={editFormData.category} onChange={handleEditChange} style={{width: '100%'}}/></td>
                    <td style={{ padding: '0.5rem' }}><input type="checkbox" name="isActive" checked={editFormData.isActive} onChange={handleEditChange} /></td>
                    <td style={{ padding: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', marginRight: '0.5rem'}} onClick={() => handleEditSubmit(event._id)}>Save</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem'}} onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '0.5rem' }}>{event.title.substring(0, 40)}{event.title.length > 40 && '...'}</td>
                    <td style={{ padding: '0.5rem' }}>{event.category || 'N/A'}</td>
                    <td style={{ padding: '0.5rem' }}>{event.isActive ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', marginRight: '0.5rem'}} onClick={() => handleEditClick(event)}>Edit</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', backgroundColor: 'var(--error-color)', color: 'white'}} onClick={() => handleDelete(event._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;
