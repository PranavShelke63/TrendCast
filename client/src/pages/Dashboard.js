import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, activityRes] = await Promise.all([
          axios.get(`/api/users/${user._id}`),
          axios.get(`/api/users/${user._id}/activity`)
        ]);
        setProfile(profileRes.data);
        setActivity(activityRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="text-center mt-2">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="mb-2">User Dashboard</h1>
      <div className="card">
        <h2 className="mb-1">Account Information</h2>
        <p className="text-muted mb-1"><strong>Username:</strong> {profile?.username}</p>
        <p className="text-muted mb-1"><strong>Email:</strong> {profile?.email}</p>
        <p className="text-muted"><strong>Account Role:</strong> <span style={{ textTransform: 'capitalize' }}>{profile?.role}</span></p>
      </div>

      <h2 className="mt-2 mb-1">Prediction History</h2>
      {activity.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Market</th>
                <th style={{ padding: '1rem' }}>Your Prediction</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <a href={`/events/${item.event?._id}`} style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
                      {item.event?.title}
                    </a>
                  </td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                    {item.event?.options.find(opt => opt.id === item.optionId)?.text || item.optionId}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`text-sm ${item.event?.isActive ? 'text-success' : 'text-error'}`}>
                      {item.event?.isActive ? 'Open' : 'Closed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center text-muted">
          You haven't made any predictions yet. Go to <a href="/markets" style={{ color: 'var(--primary-color)' }}>Markets</a> to start!
        </div>
      )}
    </div>
  );
};

export default Dashboard;
