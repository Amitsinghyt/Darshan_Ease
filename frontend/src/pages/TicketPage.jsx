import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketByBookingId } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Calendar, Clock, User, CheckCircle, Printer, ArrowLeft } from 'lucide-react';

const TicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }

    const fetchTicket = async () => {
      try {
        const data = await getTicketByBookingId(bookingId);
        setTicket(data);
      } catch (err) {
        setError('Failed to load ticket. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [bookingId, userInfo, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading your ticket...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container page-center"><p className="error-text">{error}</p></div>;
  }

  const booking = ticket?.bookingId;
  const slot = booking?.slotId;
  const temple = slot?.templeId;

  return (
    <div className="container page-center" style={{ maxWidth: '480px' }}>
      <div className="ticket-page fade-in">
        {/* Ticket Header */}
        <div className="ticket-card">
          <div className="ticket-header">
            <div className="ticket-status">
              <CheckCircle size={20} />
              <span>Confirmed</span>
            </div>
            <h2>Darshan Ticket</h2>
            <p className="ticket-id">#{ticket?._id?.slice(-8).toUpperCase()}</p>
          </div>

          {/* Ticket Tear Line */}
          <div className="ticket-tear">
            <div className="tear-circle left" />
            <div className="tear-line" />
            <div className="tear-circle right" />
          </div>

          {/* Ticket Body */}
          <div className="ticket-body">
            <div className="ticket-detail">
              <MapPin size={16} className="ticket-icon" />
              <div>
                <label>Temple</label>
                <p>{temple?.templeName}</p>
              </div>
            </div>
            <div className="ticket-detail">
              <MapPin size={16} className="ticket-icon" />
              <div>
                <label>Location</label>
                <p>{temple?.location}</p>
              </div>
            </div>
            <div className="ticket-row">
              <div className="ticket-detail">
                <Calendar size={16} className="ticket-icon" />
                <div>
                  <label>Date</label>
                  <p>{new Date(slot?.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <div className="ticket-detail">
                <Clock size={16} className="ticket-icon" />
                <div>
                  <label>Time</label>
                  <p>{slot?.startTime} - {slot?.endTime}</p>
                </div>
              </div>
            </div>
            <div className="ticket-detail">
              <User size={16} className="ticket-icon" />
              <div>
                <label>Devotee</label>
                <p>{userInfo?.name}</p>
              </div>
            </div>
          </div>

          {/* Ticket Tear Line */}
          <div className="ticket-tear">
            <div className="tear-circle left" />
            <div className="tear-line" />
            <div className="tear-circle right" />
          </div>

          {/* QR Code */}
          <div className="ticket-qr">
            <QRCodeSVG
              value={ticket?.qrCode || 'DARSHAN-EASE'}
              size={180}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1e293b"
            />
            <p className="qr-label">Scan at temple entry</p>
          </div>

          <div className="ticket-amount">
            <span>Amount Paid</span>
            <span className="amount-value">₹{booking?.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="ticket-actions no-print">
          <button className="btn btn-outline" onClick={() => navigate('/history')}>
            <ArrowLeft size={16} /> My Bookings
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
