import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../assets/profile.png';
import '../css/styles/Header.css';

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload here
      console.log('Selected file:', file);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.clear();
   

    // Navigate to the SelectUserType component
    navigate('/select-user-type');
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center px-4 py-2 header'>
        <div className='d-flex align-items-center justify-content-between gap-2'>
          <h5 className='pt-2 text-white'>QuickFix</h5>
        </div>
        <button 
          className='btn btn-danger rounded-button d-none d-md-block'
          onClick={handleLogout} // Add onClick handler for logout
        >
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className='sidebar'
        style={{ left: showSidebar ? 0 : '-300px' }}
      >
        {/* Close button */}
        <button 
          className='btn btn-link text-dark position-absolute end-0 p-3'
          onClick={() => setShowSidebar(false)}
        >
          <i className="fa-solid fa-times"></i>
        </button>

        {/* Profile section */}
        <div className='d-flex flex-column align-items-center mt-5 p-4'>
          <img 
            src={logo} 
            alt="profile" 
            className='profile-img-large'
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </div>

        {/* User Details */}
        <div className='user-details'>
          <div className='user-details-item'>
            <i className="fa-solid fa-user"></i>
            <span>Subin Thomas</span>
          </div>
          <div className='user-details-item'>
            <i className="fa-solid fa-envelope"></i>
            <span>subin@example.com</span>
          </div>
          <div className='user-details-item'>
            <i className="fa-solid fa-phone"></i>
            <span>+1 234 567 8900</span>
          </div>
          <div className='user-details-item'>
            <i className="fa-solid fa-location-dot"></i>
            <span>New York, USA</span>
          </div>
          <div className='user-details-item'>
            <i className="fa-solid fa-briefcase"></i>
            <span>Software Developer</span>
          </div>
        </div>

        {/* Logout button at bottom */}
        <button 
          className='btn btn-danger rounded-button mt-auto mx-3 mb-4'
          onClick={handleLogout} // Add onClick handler for logout
        >
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div 
          className='sidebar-overlay'
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default Header;