import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/styles/SplashPage.css';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to select-user-type page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/select-user-type');
    }, 3000); // 3000ms = 3 seconds

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container d-flex align-items-center justify-content-center vh-100 bg-warning">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-white">Welcome</h1>
        <div className="spinner-border text-white mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;