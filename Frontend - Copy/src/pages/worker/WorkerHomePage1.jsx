import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componets/Header';
import Footer from '../../componets/Footer';
import {  Button, Card } from 'react-bootstrap';
import { FaCheckCircle, FaHistory } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteBookingWhenWorkerRejectAPI, getBookingByIdAPI, getLoginWorkerAPI, toggleWorkerAvailabilityAPI, updateWorkeStatusByWorkerAPI } from '../../services/Allapi';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Carousel1 from '../../componets/Carousel1';
import Switch from 'react-switch';

const WorkerHomePage1 = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [clientRequests, setClientRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [workerDetails,setWorkerDetails] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the form has been submitted
    const formSubmitted = sessionStorage.getItem("isFormSubmitted");
    if (formSubmitted) {
      setIsFormSubmitted(true);
    }
  }, []);

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

;

  // Toggle worker availability
  const handleToggleAvailability = async () => {
    try {
      setIsOnline((prev) => !prev);

      const token = sessionStorage.getItem("token");
      const userDetails = JSON.parse(sessionStorage.getItem("userdetails"));

      if (!userDetails || !userDetails.id) {
        console.error("Worker ID not found in session storage");
        return;
      }

      const WorkerId = userDetails.id;

      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const reqBody = {
        availability: !isOnline,
      };

      const response = await toggleWorkerAvailabilityAPI(reqHeader, WorkerId, reqBody);
      console.log(response);
    } catch (error) {
      console.error("Error updating availability:", error);
      setIsOnline((prev) => !prev);
    }
  };

  // Update booking status (accept/reject)
  const handleAcceptRequest = async (bookingId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const reqBody = { status };

      const response = await updateWorkeStatusByWorkerAPI(reqHeader, reqBody, bookingId);

      if (response?.status === 200) {
        toast.success("Booking status updated successfully!", { position: "top-center" });
        setClientRequests(clientRequests.map(request =>
          request._id === bookingId ? { ...request, status } : request
        ));
        setSelectedRequest(null);
      } else {
        toast.error("Failed to update booking status", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Something went wrong", { position: "top-center" });
    }
  };

  // Delete the user request when he clicks on the reject button
  const handleRejectRequest = async (bookingId) => {
    try {
      const token = sessionStorage.getItem('token');
      const reqHeader = {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      };

      const response = await deleteBookingWhenWorkerRejectAPI(reqHeader, bookingId);
      console.log(response);

      if (response?.status === 200) {
        toast.success("Booking request deleted successfully!", { position: "top-center" });
        setClientRequests(clientRequests.filter(request => request._id !== bookingId));
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
 
  //get worker details for check if he is verified or not
  const getWorkerDetails =async()=>{
   try {
    const token = sessionStorage.getItem('token');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const response = await getLoginWorkerAPI(headers);
    if(response.status == 200){
      console.log(response);
      setWorkerDetails(response.data)
      
      
      
    }
   } catch (error) {
    console.log(error);
    
   }
  }


  useEffect(() => {
    fetchClientRequests();
    getWorkerDetails()
  }, [])


  // Open booking details
  const handleOpen = (request) => {
    setSelectedRequest(request);
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <div className="container py-4 has-header">
        {/* Welcome and Toggle Section */}
        <div className="mb-4 p-3" style={{ backgroundColor: '#fff' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column align-items-center flex-sm-row gap-1">
              <h1 className="mb-0 me-4">
                Welcome <span className="text-primary">{JSON.parse(sessionStorage.getItem("userdetails"))?.fullName || "Guest"}</span>
              </h1>
              
              {/* verification badge */}
              <div>
                {
                  workerDetails.isVerified ? 
                  <i className="fas fa-check-circle fa-2x" style={{ color: "green" }}></i> : 
                  <i className="fas fa-times-circle fa-2x" style={{ color: "red" }}></i>
                }
              </div>


              

              {/* Conditionally render the "Activate" button */}
              { workerDetails.isVerified ?  
                <div></div>
                :<Button
                variant="outline-success"
                className="rounded-pill d-flex align-items-center"
                onClick={() => navigate('/worker-form')}
              >
                <FaCheckCircle className="me-2" />
                Activate
              </Button>
                
              }
            </div>
            <div className="d-flex align-items-center">
      <span className={`me-2 ${isOnline ? "text-success" : "text-danger"}`}>
        {isOnline ? "Online" : "Offline"}
      </span>
      <Switch
        checked={isOnline}
        onChange={handleToggleAvailability}
        onColor="#86d3ff"
        onHandleColor="#2693e6"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={15}
        width={40}
        className="react-switch"
        id="material-switch"
      />
    </div>
          </div>
        </div>
        <div>
          <Carousel1/>
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
                  <Card >
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
                      onClick={() => handleRejectRequest(selectedRequest._id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
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