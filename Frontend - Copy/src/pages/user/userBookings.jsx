import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import Footer from '../../componets/Footer';
import Header from '../../componets/Header';

const UserBookings = () => {
  // Dummy data for bookings
  const bookings = [
    {
      id: 1,
      workerName: 'John Doe',
      workerPhone: '+1234567890',
      issue: 'Plumbing Repair',
      status: 'In Progress',
    },
    {
      id: 2,
      workerName: 'Jane Smith',
      workerPhone: '+0987654321',
      issue: 'Electrical Wiring',
      status: 'Completed',
    },
    {
      id: 3,
      workerName: 'Mike Johnson',
      workerPhone: '+1122334455',
      issue: 'AC Installation',
      status: 'Pending',
    },
  ];

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>

        {bookings.map((booking) => (
          <Paper key={booking.id} sx={{ p: 3, mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Worker: {booking.workerName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone: {booking.workerPhone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Issue: {booking.issue}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {booking.status}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                Edit
              </Button>
              <Button variant="contained" color="success" sx={{ mr: 2 }}>
                Complete
              </Button>
              <Button variant="contained" color="error">
                Cancel
              </Button>
            </Box>
          </Paper>
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default UserBookings;