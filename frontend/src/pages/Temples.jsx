import React, { useState, useEffect } from 'react';
import { getTemples } from '../services/templeService';
import TempleCard from '../components/TempleCard';

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const data = await getTemples();
        setTemples(data);
      } catch (err) {
        setError('Failed to fetch temples');
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Discovering sacred temples...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container page-center"><p className="error-text">{error}</p></div>;
  }

  return (
    <div className="container page-section">
      <h1 className="page-title">Explore Temples</h1>
      {temples.length === 0 ? (
        <div className="card empty-state"><p>No temples found.</p></div>
      ) : (
        <div className="grid">
          {temples.map(temple => (
            <TempleCard key={temple._id} temple={temple} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Temples;
