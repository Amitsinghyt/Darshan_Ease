import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TempleCard = ({ temple }) => {
  return (
    <div className="card temple-card fade-in">
      <div className="temple-img-wrap">
        <img 
          src={temple.image || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
          alt={temple.templeName} 
        />
      </div>
      <div className="temple-body">
        <h3>{temple.templeName}</h3>
        <p className="temple-location">
          <MapPin size={14} /> {temple.location}
        </p>
        <p className="temple-desc">
          {temple.description || 'Experience a divine and peaceful darshan at this sacred shrine. Book your slot now to avoid the crowds.'}
        </p>
        <Link to={`/temples/${temple._id}`} className="btn btn-primary" style={{ width: '100%' }}>
          View Slots <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default TempleCard;
