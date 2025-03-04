const Booking = require('../models/bookingModel');


// const User = require('../models/userModel'); // Assuming you have a User model
// const Worker = require('../models/workerModel'); // Assuming you have a Worker model

// Create a new booking

exports.createBooking = async (req, res) => {
  console.log("Inside the booking controller");

  try {
    console.log(req.body);

    const { userName, userId, WorkerId, problem, address, latitude, longitude, date, time, phoneNumber, serviceType } = req.body;
    console.log(WorkerId);

    // Validate required fields
    if (!userName || !userId || !WorkerId || !problem || !address || !date || !time || !phoneNumber || !serviceType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user has already booked this worker
    const existingBooking = await Booking.findOne({ userId, WorkerId });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this worker' });
    }

    // Create a new booking
    const booking = new Booking({
      userName,
      userId,
      WorkerId,
      problem,
      address,
      latitude,
      longitude,
      date,
      time,
      phoneNumber,
      serviceType,
    });

    // Save the booking to the database
    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Get all bookings for a worker

exports.getWorkerBookings = async (req, res) => {
    console.log("inside the getWorkerBookings ");
    
  try {
    const WorkerId = req.WorkerId; // Get WorkerId from the JWT token (attached by the middleware)
    console.log(WorkerId);
    
    // Fetch all bookings for the worker
    const bookings = await Booking.find({ WorkerId });

    // If no bookings are found, return a 404 error
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this worker' });
    }

    // Return the list of bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching worker bookings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  console.log("Fetching bookings for user...");

  try {
      const userId = req.header; // Assuming userId is extracted from the JWT token
      console.log("User ID:", userId);

      // Fetch all bookings for the user
      const bookings = await Booking.find({ userId });

      // If no bookings are found, return a 404 error
      if (bookings.length === 0) {
          return res.status(404).json({ message: "No bookings found for this user" });
      }

      // Return the list of bookings
      res.status(200).json(bookings);
  } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all bookings for a worker
// exports.getWorkerBookings = async (req, res) => {
//   try {
//     const { WorkerId } = req.params;

//     // Fetch all bookings for the worker
//     const bookings = await Booking.find({ WorkerId });

//     // Optionally, fetch user and worker details for each booking
//     const bookingsWithDetails = await Promise.all(
//       bookings.map(async (booking) => {
//         const user = await User.findById(booking.userId); // Fetch user details
//         const worker = await Worker.findById(booking.WorkerId); // Fetch worker details

//         return {
//           ...booking.toObject(),
//           user: { fullName: user.fullName, email: user.email }, // Include user details
//           worker: { fullName: worker.fullName, serviceType: worker.serviceType }, // Include worker details
//         };
//       })
//     );

//     res.status(200).json(bookingsWithDetails);
//   } catch (error) {
//     console.error('Error fetching worker bookings:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };





// Update booking status (e.g., Accept or Reject)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true } // Return the updated document
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




// Delete a booking 
exports.deleteBooking = async (req, res) => {
  console.log("insode of the Failed to delete booking request  ");
  
  try {
    const { bookingId } = req.params;

    // Delete the booking
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all bookings for the authenticated user
exports.getUserBookings = async (req, res) => {
  console.log("Fetching bookings for user...");

  try {
    const userId = req.userId; // Extract userId from the JWT middleware

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch all bookings for the user
    const bookings = await Booking.find({ userId });

    // If no bookings are found, return a 404 error
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    // Return the list of bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};