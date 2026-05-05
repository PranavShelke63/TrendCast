import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminVotes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVotes = async () => {
    try {
      const res = await axios.get('/api/admin/votes');
      setVotes(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vote?')) return;
    try {
      await axios.delete(`/api/admin/votes/${id}`);
      setVotes(votes.filter(vote => vote._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading votes...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2 className="mb-1 text-sm">Manage Votes</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.5rem' }}>Vote ID</th>
              <th style={{ padding: '0.5rem' }}>User ID</th>
              <th style={{ padding: '0.5rem' }}>Event ID</th>
              <th style={{ padding: '0.5rem' }}>Option</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote) => (
              <tr key={vote._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem' }}>{vote._id}</td>
                <td style={{ padding: '0.5rem' }}>{vote.user}</td>
                <td style={{ padding: '0.5rem' }}>{vote.event}</td>
                <td style={{ padding: '0.5rem' }}>{vote.optionId}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', backgroundColor: 'var(--error-color)', color: 'white'}} onClick={() => handleDelete(vote._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {votes.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No votes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVotes;
