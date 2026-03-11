const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');
const Ticket = require('../models/Ticket');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { slotId, totalAmount } = req.body;

  try {
    const slot = await DarshanSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const booking = new Booking({
      userId: req.user._id,
      slotId,
      totalAmount,
    });

    const createdBooking = await booking.save();

    // Decrease available seats
    slot.availableSeats -= 1;
    await slot.save();

    // Generate Ticket
    const ticket = new Ticket({
      bookingId: createdBooking._id,
      qrCode: `TICKET-${createdBooking._id}-${Date.now()}`,
    });
    await ticket.save();

    // Mark booking as confirmed
    createdBooking.status = 'Confirmed';
    await createdBooking.save();

    res.status(201).json({ booking: createdBooking, ticket });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'slotId',
        populate: { path: 'templeId', select: 'templeName location' },
      })
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate({
        path: 'slotId',
        populate: { path: 'templeId', select: 'templeName location' },
      });

    if (booking) {
      // Ensure the user owns the booking or is admin
      if (
        booking.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin'
      ) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      booking.status = 'Cancelled';
      await booking.save();

      // Increase available seats back
      const slot = await DarshanSlot.findById(booking.slotId);
      if (slot) {
        slot.availableSeats += 1;
        await slot.save();
      }

      res.json({ message: 'Booking cancelled' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
