import React, { useEffect, useState, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, Modal, Box, Avatar, IconButton, Divider } from '@mui/material';
import { Search as SearchIcon, MyLocation as MyLocationIcon, Close, AccountBalanceWallet, Payment } from '@mui/icons-material';
import Header from '../../componets/Header';
import Footer from '../../componets/Footer';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { addBookingAPI, getUserBookingByIdAPI, getVerifiedAvailableWorkerDetailsAPI } from '../../services/Allapi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SERVER_URL from '../../services/serverURL';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UserHomPage1 = () => {
  const navigate = useNavigate();
  const [searchRole, setSearchRole] = useState('');
  const [openBookingModal, setOpenBookingModal] = useState(false); // Modal for booking
  const [openBookedDetailsModal, setOpenBookedDetailsModal] = useState(false); // Modal for booked details
  const [openPaymentModal, setOpenPaymentModal] = useState(false); // Modal for payment gateway
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // Selected booking details
  const [bookingDetails, setBookingDetails] = useState({
    problem: '',
    address: '',
    latitude: '',
    longitude: '',
    date: '',
    time: '',
    phoneNumber: '',
    serviceType: ''
  });
  const [locationStatus, setLocationStatus] = useState({
    accessed: false,
    message: ''
  });
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = useCallback(() => {
    const filtered = pendingWorkers.filter(worker =>
      worker.serviceType.toLowerCase().includes(searchRole.toLowerCase())
    );
    return filtered;
  }, [pendingWorkers, searchRole]);

  const handleBooking = useCallback((worker) => {
    setSelectedWorker(worker);
    setOpenBookingModal(true);
  }, []);

 
  const handleSubmitBooking = async () => {
    const requiredFields = ['problem', 'address', 'date', 'time', 'phoneNumber', 'serviceType'];
    const missingFields = requiredFields.filter(field => !bookingDetails[field]);

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      const userDetails = JSON.parse(sessionStorage.getItem("userdetails"));
      const userId = userDetails?.id;
      const userName = userDetails?.fullName;

      const bookingData = {
        userName,
        userId,
        WorkerId: selectedWorker._id,
        WorkerName: selectedWorker.fullName,
        workerPhoneNumber: selectedWorker.phoneNumber,
        problem: bookingDetails.problem,
        address: bookingDetails.address,
        latitude: bookingDetails.latitude,
        longitude: bookingDetails.longitude,
        date: bookingDetails.date,
        time: bookingDetails.time,
        phoneNumber: bookingDetails.phoneNumber,
        serviceType: bookingDetails.serviceType,
      };

      const result = await addBookingAPI(bookingData, headers);
      if (result.request.status === 400) {
        toast.error("Waiting for worker response");
        return;
      }

      toast.success('Booking successful!');
      setOpenBookingModal(false);
      fetchUserBookings(); // Refresh bookings after successful booking
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking');
    }
  };

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setBookingDetails(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          setLocationStatus({
            accessed: true,
            message: 'Location accessed successfully'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus({
            accessed: false,
            message: 'Error accessing location. Please ensure location permissions are enabled.'
          });
        }
      );
    } else {
      setLocationStatus({
        accessed: false,
        message: 'Geolocation is not supported by your browser'
      });
    }
  }, []);

  const fetchUserBookings = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await getUserBookingByIdAPI(headers);
      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        setUserBookings(response.data);
      } else {
        console.log("Error fetching the bookings");
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  };

  const getBookingStatusForWorker = (workerId) => {
    const booking = userBookings.find((booking) => booking.WorkerId === workerId);
    return booking ? booking.status : null;
  };

  const getButtonTextAndColor = (workerId) => {
    const status = getBookingStatusForWorker(workerId);
    switch (status) {
      case 'Pending':
        return { text: 'Pending', color: '#007BFF' }; // Blue for pending
      case 'Accepted':
        return { text: 'Accepted', color: '#4caf50' }; // Green for accepted
      case 'Rejected':
        return { text: 'Rejected', color: '#f44336' }; // Red for rejected
      default:
        return { text: 'Book Now', color: '#ffca2c' }; // Default color for no booking
    }
  };

  const filteredWorkers = handleSearch();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };
        const response = await getVerifiedAvailableWorkerDetailsAPI(headers);
        if (Array.isArray(response.data)) {
          setPendingWorkers(response.data);
        } else {
          setPendingWorkers([]);
        }
      } catch (error) {
        console.error('Error fetching worker details:', error);
        setError("Failed to fetch worker details");
        toast.error("Failed to fetch worker details");
        setPendingWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
    fetchUserBookings();
  }, []);

  return (
    <>
      <Header />
      <Container style={{minHeight:'100vh'}} maxWidth="lg" sx={{ py: 4 }}>
      <h1 className="mb-3 me-4">
          Welcome <span className="text-primary">{JSON.parse(sessionStorage.getItem("userdetails"))?.fullName || "Guest"}</span>
      </h1>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6} className='d-flex gap-3 align-items-center'>
              <TextField
                fullWidth
                label="Search by Role"
                variant="outlined"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      style={{ backgroundColor: "#ffca2c" }}
                      variant="contained"
                      onClick={handleSearch}
                      startIcon={<SearchIcon />}
                    >
                      Search
                    </Button>
                  ),
                }}
              />
             
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Typography variant="h6" align="center">Loading...</Typography>
        ) : error ? (
          <Typography variant="h6" align="center" color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredWorkers.map((worker) => {
              const { text: buttonText, color: buttonColor } = getButtonTextAndColor(worker._id);
              return (
                <Grid item xs={12} sm={6} md={4} key={worker._id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={`${SERVER_URL}/${worker.profilePic}`}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">{worker.fullName}</Typography>
                          <Typography color="textSecondary">{worker.serviceType}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Experience: {worker.experience} years
                      </Typography>
                      <div className='d-flex align-items-center gap-2' style={{ width: "100%" }}>
                        <div style={{ flex: 1 }}>
                          <Button
                            style={{ backgroundColor: buttonColor, color: "white", width: "100%" }}
                            variant="contained"
                            onClick={() => handleBooking(worker)}
                            disabled={buttonText !== 'Book Now'} // Disable button if status is not 'Book Now'
                          >
                            {buttonText}
                          </Button>
                        </div>

                        {getBookingStatusForWorker(worker._id) === "Accepted" && (
                          <div>
                            <Button
                              onClick={() => setOpenPaymentModal(true)}
                              style={{ backgroundColor: buttonColor, color: "white", padding: "5px 10px" }}
                            >
                              Confirm
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Modal for Booking */}
        <Modal open={openBookingModal} onClose={() => setOpenBookingModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Book {selectedWorker?.fullName}
            </Typography>
            <TextField
              fullWidth
              required
              label="Phone Number"
              value={bookingDetails.phoneNumber}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, phoneNumber: e.target.value })
              }
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 10 }}
              placeholder="Enter your 10-digit phone number"
            />
            <TextField
              fullWidth
              required
              label="Service Type"
              value={bookingDetails.serviceType}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, serviceType: e.target.value })
              }
              sx={{ mb: 2 }}
              placeholder="e.g., Repair, Installation, Maintenance"
            />
            <TextField
              fullWidth
              required
              label="Describe your problem"
              multiline
              rows={3}
              value={bookingDetails.problem}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, problem: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Location Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Complete Address"
                  multiline
                  rows={2}
                  value={bookingDetails.address}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, address: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant={locationStatus.accessed ? "contained" : "outlined"}
                  startIcon={<MyLocationIcon />}
                  onClick={handleGetLocation}
                  sx={{
                    mb: 1,
                    bgcolor: locationStatus.accessed ? '#4caf50' : 'inherit',
                    '&:hover': {
                      bgcolor: locationStatus.accessed ? '#45a049' : ''
                    }
                  }}
                >
                  Use Current Location
                </Button>
                {locationStatus.message && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: locationStatus.accessed ? '#4caf50' : 'error.main',
                      ml: 1
                    }}
                  >
                    {locationStatus.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={bookingDetails.date}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, date: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Time"
                  InputLabelProps={{ shrink: true }}
                  value={bookingDetails.time}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, time: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Button
              style={{ backgroundColor: "#ffca2c" }}
              variant="contained"
              fullWidth
              onClick={handleSubmitBooking}
              sx={{ mt: 3 }}
            >
              Submit Booking
            </Button>
          </Box>
        </Modal>

        {/* Modal for Payment Gateway */}
        <Modal
          open={openPaymentModal}
          onClose={() => setOpenPaymentModal(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "24px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            {/* Header */}
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Payment
              </Typography>
              <IconButton onClick={() => setOpenPaymentModal(false)} style={{ padding: "0" }}>
                <Close style={{ fontSize: "24px" }} />
              </IconButton>
            </Box>

            {/* Booking Details */}
            <Typography variant="body1" style={{ marginBottom: "16px" }}>
              <strong>Worker Name:</strong> {userBookings[0]?.WorkerName}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: "16px" }}>
              <strong>Amount:</strong> ₹500
            </Typography>

            <Divider style={{ margin: "16px 0" }} />

            {/* Payment Method Selection */}
            <Typography variant="body1" style={{ marginBottom: "16px", fontWeight: "bold" }}>
              Choose Payment Method
            </Typography>

            <Grid container spacing={2} style={{ marginBottom: "20px" }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AccountBalanceWallet style={{ fontSize: "20px" }} />}
                  style={{
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Wallet
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Payment style={{ fontSize: "20px" }} />}
                  style={{
                    border: "1px solid #1976d2",
                    color: "#1976d2",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  UPI
                </Button>
              </Grid>
            </Grid>

            {/* UPI Payment Section */}
            <TextField
              fullWidth
              label="Enter UPI ID"
              variant="outlined"
              style={{ marginBottom: "16px" }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{
                backgroundColor: "#1976d2",
                color: "#ffffff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Pay Now
            </Button>
          </Box>
        </Modal>
      </Container>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default UserHomPage1;