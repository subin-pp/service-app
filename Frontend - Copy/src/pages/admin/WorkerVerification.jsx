import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "../../componets/AdminHeader";
import Footer from "../../componets/Footer";
import { approveWorkerAPI, getAllWorkerDetailsAPI } from "../../services/Allapi";
import SERVER_URL from "../../services/serverURL";
import { useWorkerContext } from "../../WorkerContext1"; // Import context


const WorkerVerification = () => {
  const { fetchPendingWorkers } = useWorkerContext()
  const [pendingWorkers, setPendingWorkers] = useState([]); // Initialize with an empty array
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };
        const response = await getAllWorkerDetailsAPI(headers);
        console.log(response);

        // Ensure that response.data is an array before setting it
        if (Array.isArray(response.data)) {
          setPendingWorkers(response.data);
        } else {
          setPendingWorkers([]); // Set to empty array if response.data is not an array
        }
      } catch (error) {
        console.error("Error fetching worker details:", error);
        setError("Failed to fetch worker details. Please try again.");
        toast.error("Failed to fetch worker details. Please try again.");
        setPendingWorkers([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
  };

  const handleApprove = async (workerId) => {
    if (!workerId) {
      toast.error("No worker selected for approval.");
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      await approveWorkerAPI(workerId, headers);
      toast.success("Worker approved successfully!");
  
      // Remove approved worker from the list
      setPendingWorkers((prevWorkers) => prevWorkers.filter(worker => worker._id !== workerId));
  
      // Refresh the count in the context
      fetchPendingWorkers();
      
      setSelectedWorker(null);
    } catch (error) {
      console.error("Error approving worker:", error);
      toast.error("Failed to approve worker. Please try again.");
    }
  };

  const handleViewDocument = (filename) => {
    if (!filename) {
      toast.error("No document available");
      return;
    }

    const fileUrl = `${SERVER_URL}/${filename}`;
    window.open(fileUrl, "_blank"); // Opens file in a new tab
  };

  return (
    <>
      <AdminHeader />
      <div style={{ minHeight: "100vh" }} className="container mt-4">
        <h2 className="mb-4">Worker Verification Requests</h2>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row">
            <div className="col-md-4">
              <div className="list-group">
                {pendingWorkers.map((worker) => (
                  <button
                    key={worker._id} // Use _id instead of id
                    className={`list-group-item list-group-item-action mt-3 ${
                      selectedWorker?._id === worker._id ? "active" : ""
                    }`}
                    onClick={() => handleViewDetails(worker)}
                  >
                    {worker.fullName} - {worker.serviceType}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-8">
              {selectedWorker ? (
                <div className="card">
                  <div className="card-header">
                    <h4>Worker Details</h4>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p><strong>Name:</strong> {selectedWorker.fullName}</p>
                        <p><strong>Age:</strong> {selectedWorker.age}</p>
                        <p><strong>Phone:</strong> {selectedWorker.phoneNumber}</p>
                        <p><strong>Place:</strong> {selectedWorker.place}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>District:</strong> {selectedWorker.district}</p>
                        <p><strong>Job Title:</strong> {selectedWorker.serviceType}</p>
                        <p><strong>Experience:</strong> {selectedWorker.experience} years</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5>Documents</h5>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleViewDocument(selectedWorker.resume)}
                        >
                          Resume
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleViewDocument(selectedWorker.profilePic)}
                        >
                          Profile Photo
                        </button>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(selectedWorker._id)} // Use _id instead of id
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedWorker._id)} // Use _id instead of id
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info">
                  Select a worker from the list to view details
                </div>
              )}
            </div>
          </div>
        )}

        <ToastContainer position="top-center" autoClose={3000} />
      </div>

      <Footer />
    </>
  );
};

export default WorkerVerification;