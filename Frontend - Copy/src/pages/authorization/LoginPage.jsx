import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import '../../css/styles/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from '../../assets/login.png'
import { loginAPI } from "../../services/Allapi";



const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErrors(prev => ({...prev, email: !emailRegex.test(value)}));
        break;
      
      case 'password':
        const isValidPassword = value.length >= 6;
        setErrors(prev => ({...prev, password: !isValidPassword}));
        break;
      
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    validateInputs(name, value);
  };

  const isFormValid = () => {
    return !errors.email && !errors.password && formData.email && formData.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const result = await loginAPI(formData);
      console.log("result", result);
  
      const statusCode = result?.status || result?.response?.status;
      console.log(statusCode);
  
      if (statusCode >= 200 && statusCode < 300) {
        setIsLoading(true);
  
        // Show success toast
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: true,
          theme: "dark",
          style: {
            borderRadius: "20px",
            padding: "20px",
            fontSize: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#28a745",
            color: "white",
          },
        });
  
       // Store token and role
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("role", result.data.role);
        sessionStorage.setItem("userdetails", JSON.stringify(result.data.user));
        
        const isBlocked = result.data.user.isBlocked;
        const role = result.data.user.role; 
        
        setTimeout(() => {
          setIsLoading(false);
           
          console.log("blocked",isBlocked);
          
          // Check if user is blocked
          if (isBlocked) {
            console.log("blocked user");
            navigate("/blocked");
           
            
            return;
          }

          // Navigate based on role
          switch (role) {
            case "user":
              navigate("/user-home");
              break;
            case "worker":
              navigate("/worker-home");
              break;
            case "admin":
              navigate("/admin-home");
              break;
            default:
              navigate("/login");
              break;
          }
        }, 1500);
      } else {
        toast.error("Invalid email or password!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: true,
          theme: "dark",
          style: {
            borderRadius: "20px",
            padding: "20px",
            fontSize: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#dc3545",
            color: "white",
          },
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
  
      toast.error(`Error: ${errorMessage}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        pauseOnHover: true,
        theme: "dark",
        style: {
          borderRadius: "20px",
          padding: "20px",
          fontSize: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#dc3545",
          color: "white",
        },
      });
    }
  };
  
   
  
  

  return (
    <div className="d-flex align-items-center justify-content-center " style={{minHeight:'100vh'}}>
      <div className="container">
        <div className="row shadow-lg overflow-hidden mx-auto" style={{ maxWidth: "1000px" }}>
          {/* Left Section */}
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4">
            {/* Logo */}
            <div className="text-center mb-4">
              
              <h2 className="mt-3">Login </h2>
              <p className="text-muted">Welcome back friend</p>
            </div>

            {/* Form */}
            <form className="w-100 d-flex flex-column align-items-center gap-3" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="login-container">
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

              {/* Password */}
              <div className="mb-3 d-flex flex-column align-items-center">
                <div className="login-container">
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
                className="submit-button"
                disabled={!isFormValid() || isLoading}
                type="submit"
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            {/* Login Redirect */}
            <div className="text-center mt-3">
              <p className="text-muted fw-bold">
                Don't you have account? <Link to="/create-account" className="text-primary">Sign up</Link>
              </p>
            </div>
          </div>

          {/* Right Section (Optional) */}
          <div className="col-md-6  bg-warning">
            <img className="img-fluid" src={Login} alt="" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
