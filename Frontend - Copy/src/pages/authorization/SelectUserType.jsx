import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { UserCircle, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import "../../css/styles/SelectUserType.css";

const SelectUserType = () => {
  const navigate = useNavigate();

  const handleUserTypeSelection = (userType) => {
    // Store the user type in sessionStorage
    sessionStorage.setItem("userType", userType);
  
    // Navigate to the login page
    navigate("/login");
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Select User Type</h2>
          <div className="row justify-content-center">
            {/* Regular User Card */}
            <div className="col-md-5 mb-4 mb-md-0">
              <Card
                onClick={() => handleUserTypeSelection("user")}
                className="h-100 shadow-sm user-type-card"
              >
                <Card.Body className="d-flex flex-column align-items-center p-5">
                  <UserCircle size={80} className="mb-4 text-warning" />
                  <Card.Title className="text-center mb-3">Regular User</Card.Title>
                  <Card.Text className="text-center text-muted">
                    Access our services as a regular user looking for professional assistance
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>

            {/* Professional Employee Card */}
            <div className="col-md-5">
              <Card
                onClick={() => handleUserTypeSelection("worker")}
                className="h-100 shadow-sm user-type-card"
              >
                <Card.Body className="d-flex flex-column align-items-center p-5">
                  <Briefcase size={80} className="mb-4 text-warning" />
                  <Card.Title className="text-center mb-3">Professional Employee</Card.Title>
                  <Card.Text className="text-center text-muted">
                    Join as a professional to offer your services and expertise
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default SelectUserType;