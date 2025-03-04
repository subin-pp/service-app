const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  WorkerId: { type: String, required: true },  // Reference to the worker
  problem: { type: String, required: true }, // Problem description
  address: { type: String, required: true }, // User's address
  latitude: { type: String }, // Latitude for location
  longitude: { type: String }, // Longitude for location
  date: { type: Date, required: true }, // Booking date
  time: { type: String, required: true }, // Booking time
  phoneNumber: { type: String, required: true }, // User's phone number
  serviceType: { type: String, required: true }, // Service type (e.g., Plumbing, Electrician)
  status: { type: String, default: 'Pending' } // Booking status (e.g., Pending, Accepted, Rejected)
});

const booking = mongoose.model('Booking', bookingSchema);
module.exports = booking