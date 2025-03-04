const express = require('express');
const bookingRouter = express.Router();
const bookingController = require('../controllers/bookingController');
const jwtMiddleware = require('../middlewares/jwtMiddlewares');

// Create a new booking
bookingRouter.post('/bookings', jwtMiddleware, bookingController.createBooking);

// Get all bookings for a user
// bookingRouter.get('/users/:userId/bookings', jwtMiddleware, bookingController.getUserBookings);

// // Get all bookings for a worker
bookingRouter.get('/worker-bookings', jwtMiddleware, bookingController.getWorkerBookings);


// Update booking status when 
bookingRouter.put('/bookings/:bookingId', jwtMiddleware, bookingController.updateBookingStatus);

// // Delete a booking when wroker reject the work
bookingRouter.delete('/bookings-delete/:bookingId', jwtMiddleware, bookingController.deleteBooking);


//get bookings details for user 
bookingRouter.get('/user-bookings', jwtMiddleware, bookingController.getUserBookings);

module.exports = bookingRouter;