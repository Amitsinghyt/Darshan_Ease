import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { createBooking } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Smartphone, Shield, CheckCircle, Loader } from 'lucide-react';

const PaymentPage = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useContext(AuthContext);

  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }

    const fetchSlot = async () => {
      try {
        const { data } = await API.get(`/slots/${slotId}`);
        setSlot(data);
      } catch (err) {
        setError('Failed to fetch slot details');
      } finally {
        setLoading(false);
      }
    };
    fetchSlot();
  }, [slotId, userInfo, navigate]);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const res = await createBooking({
        slotId: slot._id,
        totalAmount: slot.price,
      });
      setPaymentSuccess(true);

      // Redirect to ticket page after showing success
      setTimeout(() => {
        navigate(`/ticket/${res.booking._id}`);
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error && !slot) {
    return <div className="container page-center"><p className="error-text">{error}</p></div>;
  }

  if (paymentSuccess) {
    return (
      <div className="page-loader">
        <div className="payment-success-anim">
          <CheckCircle size={64} color="#10b981" />
          <h2>Payment Successful!</h2>
          <p>Redirecting to your ticket...</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="page-loader">
        <div className="payment-processing">
          <div className="spinner" />
          <h2>Processing Payment...</h2>
          <p>Please do not close this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-center" style={{ maxWidth: '520px' }}>
      <div className="payment-page fade-in">
        <div className="payment-header">
          <Shield size={24} />
          <h1>Secure Payment</h1>
        </div>

        {/* Order Summary */}
        <div className="payment-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Temple</span>
            <span className="summary-value">{slot?.templeId?.templeName}</span>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <span className="summary-value">{new Date(slot?.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <span className="summary-value">{slot?.startTime} - {slot?.endTime}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Darshan Fee</span>
            <span className="summary-value">₹{slot?.price}</span>
          </div>
          <div className="summary-row">
            <span>Service Charge</span>
            <span className="summary-value text-success">FREE</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{slot?.price}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="method-options">
            <label className={`method-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
              />
              <Smartphone size={20} />
              <div>
                <strong>UPI</strong>
                <small>Google Pay, PhonePe, Paytm</small>
              </div>
            </label>
            <label className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <CreditCard size={20} />
              <div>
                <strong>Credit / Debit Card</strong>
                <small>Visa, Mastercard, RuPay</small>
              </div>
            </label>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary pay-btn" onClick={handlePayment}>
          Pay ₹{slot?.price}
        </button>

        <p className="payment-secure-text">
          <Shield size={14} /> 256-bit SSL Encrypted · Safe & Secure
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
