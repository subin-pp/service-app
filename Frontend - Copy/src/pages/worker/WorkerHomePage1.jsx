import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componets/Header';
import Footer from '../../componets/Footer';
import { Form, Button, Card } from 'react-bootstrap';
import { FaCheckCircle, FaHistory } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteBookingWhenWorkerRejectAPI, getBookingByIdAPI, updateWorkeStatusByWorkerAPI } from '../../services/Allapi';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const WorkerHomePage1 = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [clientRequests, setClientRequests] = useState([]); // Initialize with an empty array
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const cardStyle = {
    boxShadow: 'none',
    border: '1px solid rgba(0,0,0,.125)'
  };

  // Fetch client requests from the API
  const fetchClientRequests = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      const response = await getBookingByIdAPI(headers);
      console.log(response.data);
  
      if (Array.isArray(response.data)) {
        setClientRequests(response.data);
      } else {
        setClientRequests([]);
      }
    } catch (error) {
      console.error('Error fetching client requests:', error);
      setClientRequests([]);
    }
  };
  
  useEffect(() => {
    fetchClientRequests();
  }, []); 


  // Update booking status (accept/reject)
  const handleAcceptRequest = async (bookingId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      // console.log(reqHeader);
      
      const reqBody = { status }; // Use the status parameter

      const response = await updateWorkeStatusByWorkerAPI(reqHeader, reqBody, bookingId);

      if (response?.status === 200) {
        toast.success("Booking status updated successfully!", { position: "top-center" });
        console.log("Booking status updated successfully", response.data);
        // Update the clientRequests state to reflect the change
        setClientRequests(clientRequests.map(request =>
          request._id === bookingId ? { ...request, status } : request
        ));
        setSelectedRequest(null); // Close the details view
      } else {
        toast.error("Failed to update booking status", { position: "top-center" });
        console.log(response);
        
        console.log("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Something went wrong", { position: "top-center" });
    }
  };

  //delete the user request when he click on the reject 
  const handleRejectRequest = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log("Token:", token);
  
      const reqHeader = {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      };
  
      const response = await deleteBookingWhenWorkerRejectAPI(reqHeader, bookingId);
      console.log(response);
  
      if (response?.status === 200) {
        toast.success("Booking request deleted successfully!", { position: "top-center" });
  
        // Remove the deleted booking from the state
        setClientRequests(clientRequests.filter(request => request._id !== bookingId));
  
        // 🔴 Close the details section if the deleted request was selected
        if (selectedRequest && selectedRequest._id === bookingId) {
          setSelectedRequest(null);
        }
  
      } else {
        toast.error("Failed to delete booking request", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error deleting booking request:", error);
      toast.error("Something went wrong", { position: "top-center" });
    }
  };
  

  // Open booking details
  const handleOpen = (request) => {
    setSelectedRequest(request);
  };

  return (
    <>
    <ToastContainer/>
      <Header />
      <div className="container py-4 has-header">
        {/* Welcome and Toggle Section */}
        <div className="mb-4 p-3" style={{ backgroundColor: '#fff' }}>
          <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex  flex-column flex-sm-row gap-2">
              <h1 className="mb-0 me-4">
                Welcome <span className="text-primary">{JSON.parse(sessionStorage.getItem("userdetails"))?.fullName || "Guest"}</span>
              </h1>

              {/* Worker history */}
              <Button
                variant="outline-primary"
                className="rounded-pill d-flex align-items-center"
                onClick={() => navigate('/worker/history')}
              >
                <FaHistory className="me-2" />
                View History
              </Button>

              {/* Worker active account section */}
              <Button
                variant="outline-success"
                className="rounded-pill d-flex align-items-center"
                onClick={() => navigate('/worker-form')}
              >
                <FaCheckCircle className="me-2" />
                Activate
              </Button>
            </div>
            <div className="d-flex align-items-center">
              <span className={`me-2 ${isOnline ? 'text-success' : 'text-danger'}`}>{isOnline ? 'Online' : 'Offline'}</span>
              <Form.Check type="switch" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          {/* Total Work Card */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card h-100" style={cardStyle}>
              <div className="card-body text-center">
                <h2 className="display-4 text-primary mb-2">25</h2>
                <p className="text-muted mb-3">Total Work Taken</p>
                <div className="progress">
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: '75%' }}
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Hours Card */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card h-100" style={cardStyle}>
              <div className="card-body text-center">
                <h2 className="display-4 text-success mb-2">8.5</h2>
                <p className="text-muted mb-3">Login Hours</p>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: '50%' }}
                    aria-valuenow="50"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Login Card */}
          <div className="col-md-4">
            <div className="card h-100" style={cardStyle}>
              <div className="card-body text-center">
                <h2 className="display-4 text-info mb-2">15</h2>
                <p className="text-muted mb-3">Daily Login</p>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: '66%' }}
                    aria-valuenow="66"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Requests Section */}
        <div className="mb-4">
          <h3>Client Requests</h3>
          {clientRequests.length === 0 ? (
            <p className="text-center text-muted">No client request received yet.</p>
          ) : (
            <div className="row">
              {clientRequests.map((request) => (
                <div key={request._id} className="col-md-6 mb-3">
                  <Card style={cardStyle}>
                    <Card.Body>
                      <Card.Title>Name: {request.userName}</Card.Title>
                      <Card.Text>
                        <strong>Address:</strong> {request.address}<br />
                        <strong>Description:</strong> {request.problem}
                      </Card.Text>
                      <div className="d-flex gap-2">
                        <Button variant="success" onClick={() => handleOpen(request)}>
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Location Interface with Map */}
        {selectedRequest && (
          <div className="mt-4 p-4 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
            <h4 className="mb-3">Client Location Details</h4>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <strong>Client Name:</strong> {selectedRequest.userName}
                </div>
                <div className="mb-3">
                  <strong>Phone Number:</strong> {selectedRequest.phoneNumber}
                </div>
                <div className="mb-3">
                  <strong>Full Address:</strong> {selectedRequest.address}
                </div>
                <div className="mb-3">
                  <div className='d-flex gap-3'>
                    <Button
                      variant="success"
                      onClick={() => handleAcceptRequest(selectedRequest._id, "Accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={()=>handleRejectRequest(selectedRequest._id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                {/* Google Maps iframe without API key */}
                <iframe
                  width="100%"
                  height="400"
                  style={{ borderRadius: '8px', border: 'none' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${selectedRequest.latitude},${selectedRequest.longitude}&hl=es&z=14&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WorkerHomePage1;