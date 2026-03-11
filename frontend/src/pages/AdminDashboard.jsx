import React, { useState, useEffect } from 'react';
import { getTemples } from '../services/templeService';
import API from '../services/api';
import { Plus, Trash, Edit, MapPin, Search, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    templeName: '',
    location: '',
    darshanStartTime: '06:00',
    darshanEndTime: '20:00',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const data = await getTemples();
      setTemples(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/temples', formData);
      setShowAddForm(false);
      setFormData({
        templeName: '',
        location: '',
        darshanStartTime: '06:00',
        darshanEndTime: '20:00',
        description: '',
        image: ''
      });
      fetchTemples();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create temple');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this temple? This will remove all associated slots and bookings.')) {
      try {
        await API.delete(`/temples/${id}`);
        fetchTemples();
      } catch (err) {
        alert('Failed to delete temple');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <div className="dashboard-header fade-in">
        <h1 className="page-title">Admin Dashboard</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          {showAddForm ? 'Cancel' : (
            <><Plus size={18} /> Add New Temple</>
          )}
        </button>
      </div>

      {showAddForm && (
        <div className="card fade-in" style={{ padding: '32px', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px' }}>Register New Temple</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Temple Name</label>
                <input name="templeName" value={formData.templeName} onChange={handleChange} required placeholder="e.g. Somnath Temple" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Veraval, Gujarat" />
              </div>
              <div className="form-group">
                <label>Darshan Start Time</label>
                <input type="time" name="darshanStartTime" value={formData.darshanStartTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Darshan End Time</label>
                <input type="time" name="darshanEndTime" value={formData.darshanEndTime} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Image URL</label>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief history or significance..."></textarea>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Temple Profile</button>
          </form>
        </div>
      )}

      <div className="dashboard-content fade-in">
        <h3 style={{ marginBottom: '20px' }}>Temple Directory</h3>
        {temples.length === 0 ? (
          <div className="card empty-state"><p>No temples registered yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Temple Details</th>
                  <th>Location</th>
                  <th>Darshan Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {temples.map(temple => (
                  <tr key={temple._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{temple.templeName}</div>
                    </td>
                    <td>
                      <div className="meta-item">
                        <MapPin size={14} /> {temple.location}
                      </div>
                    </td>
                    <td>
                      <div className="meta-item">
                        <Clock size={14} /> {temple.darshanStartTime} - {temple.darshanEndTime}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="icon-btn edit" title="Edit Temple">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(temple._id)} className="icon-btn delete" title="Delete Temple">
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
