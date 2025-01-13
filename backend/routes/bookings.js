const express = require('express');
const router = express.Router();

// In-memory storage for bookings (replace with database in production)
let bookings = [];

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const booking = {
            id: Date.now().toString(),
            businessId: req.body.businessId,
            date: req.body.date,
            time: req.body.time,
            service: req.body.service,
            notes: req.body.notes,
            status: 'pending',
            createdAt: new Date()
        };

        bookings.push(booking);
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking' });
    }
});

// Get bookings for a business
router.get('/business/:businessId', async (req, res) => {
    try {
        const businessBookings = bookings.filter(
            booking => booking.businessId === req.params.businessId
        );
        res.json(businessBookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

module.exports = router; 