import React, { useState } from 'react';
import Header from '../../componets/Header';
import Footer from '../../componets/Footer';
import { Table, Badge, Form, Row, Col, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const WorkerHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample worker data (this would come from your backend/context)
  const workerData = {
    id: "W123",
    name: "John Worker",
    service: "Electrical",
    totalEarnings: 6500
  };

  // Sample work history data (filtered for this specific worker's service)
  const workHistory = [
    {
      id: 1,
      clientName: "John Doe",
      service: "Electrical Repair",
      date: "2025-02-19",
      address: "123 Main St, Thrissur",
      status: "completed",
      payment: 1500,
      rating: 4.5,
      phone: "+91 9876543210",
      requestDetails: "Main circuit board repair needed"
    },
    {
      id: 2,
      clientName: "Jane Smith",
      service: "Switch Installation",
      date: "2025-02-20",
      address: "456 Oak Ave, Thrissur",
      status: "pending",
      payment: 2000,
      rating: null,
      phone: "+91 9876543211",
      requestDetails: "New modular switch installation"
    },
    {
      id: 3,
      clientName: "Mike Johnson",
      service: "Wiring Work",
      date: "2025-02-18",
      address: "789 Pine Rd, Thrissur",
      status: "in-progress",
      payment: 3000,
      rating: null,
      phone: "+91 9876543212",
      requestDetails: "Complete house rewiring"
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: { bg: 'success', text: 'Completed', icon: '✓' },
      pending: { bg: 'warning', text: 'Pending', icon: '⌛' },
      'in-progress': { bg: 'info', text: 'In Progress', icon: '🔧' },
      cancelled: { bg: 'danger', text: 'Cancelled', icon: '✕' }
    };

    const style = statusStyles[status] || { bg: 'secondary', text: status, icon: '' };
    return (
      <Badge 
        bg={style.bg} 
        className="px-3 py-2"
        style={{ fontSize: '0.85rem' }}
      >
        {style.icon} {style.text}
      </Badge>
    );
  };

  const filteredHistory = workHistory
    .filter(work => {
      if (filter === 'all') return true;
      return work.status === filter;
    })
    .filter(work => {
      const searchLower = searchTerm.toLowerCase();
      return (
        work.clientName.toLowerCase().includes(searchLower) ||
        work.service.toLowerCase().includes(searchLower) ||
        work.address.toLowerCase().includes(searchLower)
      );
    });

  return (
    <>
      <Header />
      <div className="container py-4 has-header">
        <div className="mb-4">
          <h2>Service History</h2>
          <p className="text-muted">Service Type: {workerData.service}</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-muted small">Filter by Status</Form.Label>
                  <Form.Select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-pill"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-muted small">Search</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Search by client, service, or address"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-pill"
                    />
                    <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Work History Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="border-0">Date</th>
                    <th className="border-0">Client Details</th>
                    <th className="border-0">Service</th>
                    <th className="border-0">Request Details</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(work => (
                    <tr key={work.id} className="border-bottom">
                      <td>{new Date(work.date).toLocaleDateString()}</td>
                      <td>
                        <div className="fw-bold">{work.clientName}</div>
                        <div className="small text-muted">{work.phone}</div>
                        <div className="small text-muted">{work.address}</div>
                      </td>
                      <td>{work.service}</td>
                      <td>
                        <div className="text-wrap" style={{ maxWidth: '200px' }}>
                          {work.requestDetails}
                        </div>
                      </td>
                      <td>{getStatusBadge(work.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default WorkerHistory;
