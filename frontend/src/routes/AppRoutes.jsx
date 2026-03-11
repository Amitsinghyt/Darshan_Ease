import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Temples from '../pages/Temples';
import SlotSelection from '../pages/SlotSelection';
import Booking from '../pages/Booking';
import PaymentPage from '../pages/PaymentPage';
import TicketPage from '../pages/TicketPage';
import BookingHistory from '../pages/BookingHistory';
import AdminDashboard from '../pages/AdminDashboard';
import OrganizerDashboard from '../pages/OrganizerDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/temples" element={<Temples />} />
            <Route path="/temples/:id" element={<SlotSelection />} />
            <Route path="/booking/:slotId" element={<Booking />} />
            <Route path="/payment/:slotId" element={<PaymentPage />} />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;

