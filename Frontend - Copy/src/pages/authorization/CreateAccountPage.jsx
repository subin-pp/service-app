import React, { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, Phone } from "lucide-react"; // Added Phone icon
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../../css/styles/CreateAccount.css';
import Login from '../../assets/login.png';
import { registerAPI } from "../../services/Allapi";

const CreateAccountPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '', // Added phoneNumber
    role: sessionStorage.getItem("userType") || "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    password: false,
    phoneNumber: false, // Added phoneNumber
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (name, value) => {
    switch (name) {
      case 'fullName':
        const nameRegex = /^[A-Za-z\s]{3,}$/;
        setErrors(prev => ({ ...prev, fullName: !nameRegex.test(value) }));
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors(prev => ({ ...prev, email: !emailRegex.test(value) }));
        break;

      case 'password':
        const isValidPassword = value.length >= 6;
        setErrors(prev => ({ ...prev, password: !isValidPassword }));
        break;

      case 'phoneNumber':
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,6}$/im;
        setErrors(prev => ({ ...prev, phoneNumber: !phoneRegex.test(value) }));
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateInputs(name, value);
  };

  const isFormValid = () => {
    return (
      !errors.fullName &&
      !errors.email &&
      !errors.password &&
      !errors.phoneNumber && // Added phoneNumber validation
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.phoneNumber // Added phoneNumber validation
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);

      const result = await registerAPI(formData);
      console.log("Registration result:", result);

      const statusCode = result?.status || result?.response?.status;
      console.log(statusCode);

      if (statusCode >= 200 && statusCode < 300) {
        setIsLoading(true);

        toast.success("Account created successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: true,
          theme: "dark",
          style: {
            borderRadius: '20px',
            padding: '20px',
            fontSize: '16px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#28a745',
            color: 'white',
          },
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate('/login');
        }, 2000);
      } else {
        toast.error("Account already exists. Please login.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: true,
          theme: "dark",
          style: {
            borderRadius: '20px',
            padding: '20px',
            fontSize: '16px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#dc3545',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.log("Registration error:", error);

      const errorMessage = error?.response?.data?.message || "Something went wrong";

      toast.error(`Error: ${errorMessage}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        pauseOnHover: true,
        theme: "dark",
        style: {
          borderRadius: '20px',
          padding: '20px',
          fontSize: '16px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#dc3545',
          color: 'white',
        },
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row shadow-lg overflow-hidden mx-auto" style={{ maxWidth: "1000px" }}>
          {/* Left Section */}
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4">
            <div className="text-center mb-4">
              <h2 className="mt-3">Create Account</h2>
              <p className="text-muted">Get started with your free account</p>
            </div>

            <form className="w-100 d-flex flex-column align-items-center gap-1 px-1">
              {/* Full Name */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="create-account-container">
                  <User size={16} />
                  <input
                    type="text"
                    name="fullName"
                    className="input-field"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.fullName && (
                  <small className="text-danger">Name should contain only letters and be at least 3 characters</small>
                )}
              </div>

              {/* Email */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="create-account-container">
                  <Mail size={16} />
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && (
                  <small className="text-danger">Please enter a valid email address</small>
                )}
              </div>

              {/* Phone Number */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="create-account-container">
                  <Phone size={16} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="input-field"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.phoneNumber && (
                  <small className="text-danger">Please enter a valid phone number</small>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="create-account-container">
                  <Lock size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input-field"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <small className="text-danger">Password must be at least 6 characters long</small>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="submit-button"
                type="submit"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center mt-3">
              <p className="text-muted fw-bold">
                Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-md-6 bg-warning">
            <img className="img-fluid" src={Login} alt="" />
          </div>
        </div>
      </div>

      {/* ToastContainer to display the toast */}
      <ToastContainer />
    </div>
  );
};

export default CreateAccountPage;