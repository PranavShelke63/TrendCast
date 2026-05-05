import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', email: '', role: 'user' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await axios.put(`/api/admin/users/${id}`, editFormData);
      setUsers(users.map(user => user._id === id ? res.data : user));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return (
    <div>
      <h2 className="mb-1 text-sm">Manage Users</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.5rem' }}>Username</th>
              <th style={{ padding: '0.5rem' }}>Email</th>
              <th style={{ padding: '0.5rem' }}>Role</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {editingId === user._id ? (
                  <>
                    <td style={{ padding: '0.5rem' }}><input name="username" value={editFormData.username} onChange={handleEditChange} style={{width: '100%'}}/></td>
                    <td style={{ padding: '0.5rem' }}><input name="email" value={editFormData.email} onChange={handleEditChange} style={{width: '100%'}}/></td>
                    <td style={{ padding: '0.5rem' }}>
                      <select name="role" value={editFormData.role} onChange={handleEditChange} style={{width: '100%', padding: '0.2rem'}}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', marginRight: '0.5rem'}} onClick={() => handleEditSubmit(user._id)}>Save</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem'}} onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '0.5rem' }}>{user.username}</td>
                    <td style={{ padding: '0.5rem' }}>{user.email}</td>
                    <td style={{ padding: '0.5rem' }}>{user.role}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', marginRight: '0.5rem'}} onClick={() => handleEditClick(user)}>Edit</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', backgroundColor: 'var(--error-color)', color: 'white'}} onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
