import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../css/styles/AdminHeader.css";
import { useNavigate } from "react-router-dom";
import { useWorkerContext } from "../WorkerContext1"; // Import context

const AdminHeader = () => {
  const navigate = useNavigate();
  const { pendingRequests } = useWorkerContext(); // Get pending requests from context

  return (
    <>
      <Navbar className="admin-header" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand className="text-white fw-bold">Service App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-5">
              <Nav.Link className="text-white nav-link" onClick={() => navigate("/admin-home")}>
                Home
              </Nav.Link>
              <Nav.Link className="text-white nav-link" onClick={() => navigate("/admin-home/user")}>
                Manage Users
              </Nav.Link>
              <Nav.Link className="text-white nav-link" onClick={() => navigate("/admin-home/worker")}>
                Manage Workers
              </Nav.Link>
              <Nav.Link
                className="text-white nav-link position-relative"
                onClick={() => navigate("/admin-home/worker-verification")}
              >
                Worker Verification
                {pendingRequests > 0 && (
                  <span className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger">
                    {pendingRequests}
                  </span>
                )}
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center">
              <Button variant="danger" className="rounded-pill">
                Logout <i className="fas fa-sign-out-alt ms-1"></i>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminHeader;
