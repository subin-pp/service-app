import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const BlockedAccountModal = () => {
  const [showModal, setShowModal] = useState(true); // Modal opens by default

  // Additional details to display in the modal
  const blockedDetails = {
    reason: "Violation of terms of service",
    contactEmail: "@example.com",
  };

  // Automatically open the modal when the component mounts
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Account Blocked</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">
          Your account has been blocked by the admin. Please review the details below:
        </p>
        <ul>
          <li>
            <strong>Reason:</strong> {blockedDetails.reason}
          </li>
         
          <li>
            <strong>Contact Support:</strong>{" "}
            <a href={`mailto:${blockedDetails.contactEmail}`}>{blockedDetails.contactEmail}</a>
          </li>
        </ul>
        <p className="text-muted">
          If you believe this is a mistake, please contact support for further assistance.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default BlockedAccountModal;