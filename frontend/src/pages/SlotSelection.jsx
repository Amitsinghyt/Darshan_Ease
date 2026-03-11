import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTempleById, getSlots } from '../services/templeService';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const SlotSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templeData = await getTempleById(id);
        const slotsData = await getSlots(id);
        setTemple(templeData);
        setSlots(slotsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBook = (slotId) => {
    navigate(`/booking/${slotId}`);
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Fetching available darshan slots...</p>
      </div>
    );
  }

  if (!temple) return <div className="container page-center"><p>Temple not found</p></div>;

  return (
    <div className="container page-section">
      <div className="card temple-detail-card fade-in" style={{ padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <img 
            src={temple.image || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
            alt={temple.templeName}
            className="temple-detail-img"
            style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: '10px' }}>{temple.templeName}</h1>
            <p className="temple-location">
              <MapPin size={18} /> {temple.location}
            </p>
            <p style={{ marginBottom: '20px', color: 'var(--text-mid)' }}>{temple.description}</p>
            <div className="meta-item">
              <Clock size={16} /> 
              <span>Darshan Hours: {temple.darshanStartTime} - {temple.darshanEndTime}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="page-title">Available Slots</h2>
      {slots.length === 0 ? (
        <div className="card empty-state">
          <p>No slots available for this temple at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid">
          {slots.map(slot => (
            <div key={slot._id} className="card slot-card fade-in">
              <div className="slot-header">
                <span className="slot-date">{new Date(slot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="slot-price">₹{slot.price}</span>
              </div>
              <div className="slot-meta" style={{ marginBottom: '20px' }}>
                <p className="meta-item" style={{ marginBottom: '8px' }}>
                  <Clock size={16} /> {slot.startTime} - {slot.endTime}
                </p>
                <p className={`meta-item ${slot.availableSeats > 0 ? 'seats-available' : 'seats-full'}`}>
                  <Users size={16} /> {slot.availableSeats} seats remaining
                </p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={slot.availableSeats === 0}
                onClick={() => handleBook(slot._id)}
              >
                {slot.availableSeats > 0 ? (
                  <>Book Now <ArrowRight size={16} /></>
                ) : 'Housefull'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotSelection;
