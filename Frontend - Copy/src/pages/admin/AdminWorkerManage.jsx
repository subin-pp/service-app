import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Card, Container } from 'react-bootstrap';
import AdminHeader from '../../componets/AdminHeader';
import Footer from '../../componets/Footer';
import { toast } from 'react-toastify';
import { getVerifiedWorkerAPI, blockWorkerAPI, unblockWorkerAPI } from '../../services/Allapi';
import SERVER_URL from '../../services/serverURL';

const AdminWorkerManage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllVerifiedWorkerDetails();
  }, []);

  const getAllVerifiedWorkerDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated. Please log in.");
        return;
      }
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
      const response = await getVerifiedWorkerAPI(headers);
      if (response.status === 200) {
        setWorkers(response.data);
      } else {
        toast.error("Failed to fetch worker data");
      }
    } catch (error) {
      console.error("Error fetching verified worker details:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized access. Please log in again.");
        sessionStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlockWorker = async (workerId) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
      const response = await blockWorkerAPI(headers, workerId);
      if (response.status === 200) {
        toast.success("Worker blocked successfully");
        setWorkers(prevWorkers =>
          prevWorkers.map(worker =>
            worker._id === workerId ? { ...worker, status: "blocked" } : worker
          )
        );
      } else {
        toast.error("Failed to block worker");
      }
    } catch (error) {
      console.error("Error blocking worker:", error);
      toast.error("Error blocking worker");
    }
  };

  const handleUnblockWorker = async (workerId) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
      const response = await unblockWorkerAPI(headers, workerId);
      if (response.status === 200) {
        toast.success("Worker unblocked successfully");
        setWorkers(prevWorkers =>
          prevWorkers.map(worker =>
            worker._id === workerId ? { ...worker, status: "active" } : worker
          )
        );
      } else {
        toast.error("Failed to unblock worker");
      }
    } catch (error) {
      console.error("Error unblocking worker:", error);
      toast.error("Error unblocking worker");
    }
  };

  const getStatusText = (status) => {
    const statusStyles = {
      active: { color: 'green', text: 'Active' },
      blocked: { color: 'red', text: 'Blocked' },
      pending: { color: 'orange', text: 'Pending' }
    };
    const style = statusStyles[status] || { color: 'black', text: status || 'Unknown' };
    return <span style={{ color: style.color }}>{style.text}</span>;
  };

  const filteredWorkers = workers.filter(worker => {
    if (filter === 'all') return true;
    return worker.status === filter;
  }).filter(worker => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (worker.name || '').toLowerCase().includes(searchLower) ||
      (worker.email || '').toLowerCase().includes(searchLower) ||
      (worker.service || '').toLowerCase().includes(searchLower) ||
      (worker.phone || '').toString().includes(searchTerm)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AdminHeader />
      <Container className="py-4" style={{ marginTop: '80px' }}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Worker Management</h2>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '250px' }}
                />
                
              </div>
            </div>

            <Table hover responsive className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Experience</th>
                  <th>Contact</th>
                  <th>Completed Jobs</th>
                  <th>Place</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.map((worker, index) => (
                  <tr key={worker.id || index}>
                    <td>
                      <div>
                        <div className="fw-bold">{worker.fullName}</div>
                        <small className="text-muted">{worker.email}</small>
                      </div>
                    </td>
                    <td>{worker.serviceType}</td>
                    <td>{worker.experience}</td>
                    <td>{worker.phoneNumber}</td>
                    <td>{worker.totalWorkTaken}</td>
                    <td>{worker.place}</td>
                    <td>{worker.age}</td>
                    <td>{getStatusText(worker.status)}</td>
                    <td>
                      {worker.resume ? (
                        <Button variant="info" size="sm" href={`${SERVER_URL}/${worker.resume}`} target="_blank">See Resume</Button>
                      ) : (
                        <span className="text-muted">No Resume</span>
                      )}
                    </td>
                    <td>
                      {worker.profilePic ? (
                        <Button variant="info" size="sm" href={`${SERVER_URL}/${worker.profilePic}`} target="_blank">See Profile</Button>
                      ) : (
                        <span className="text-muted">No Photo</span>
                      )}
                    </td>
                    <td>
                      {worker.status === 'blocked' ? (
                        <Button variant="success" size="sm" onClick={() => handleUnblockWorker(worker._id)}>Unblock</Button>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => handleBlockWorker(worker._id)}>Block</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AdminWorkerManage;
