const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById).delete(protect, cancelBooking);

module.exports = router;
