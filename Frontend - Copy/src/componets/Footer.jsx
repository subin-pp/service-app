import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 border">
      <div className="container">
        <div className="row gy-4">
          {/* Project/Company Section */}
          <div className="col-lg-4 col-md-6">
            <h3 className="text-warning fw-bold mb-3">Service App</h3>
            <p className="text-light mb-4">
              Your trusted platform for finding and booking professional services. 
              We connect skilled service providers with customers, making service 
              booking simple, reliable, and efficient.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="text-warning mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#about" className="text-light text-decoration-none hover-warning">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#services" className="text-light text-decoration-none hover-warning">Services</a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-light text-decoration-none hover-warning">Contact</a>
              </li>
              <li className="mb-2">
                <a href="#privacy" className="text-light text-decoration-none hover-warning">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-warning mb-3">Contact Info</h5>
            <div className="d-flex flex-column gap-2">
              <p className="mb-1">
                <i className="fas fa-phone text-warning me-2"></i>
                +1 234 567 8900
              </p>
              <p className="mb-1">
                <i className="fas fa-envelope text-warning me-2"></i>
                info@example.com
              </p>
              <p className="mb-1">
                <i className="fas fa-map-marker-alt text-warning me-2"></i>
                123 Street, City, Country
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="col-lg-3 col-md-6">
            <h5 className="text-warning mb-3">Connect With Us</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light hover-warning">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light hover-warning">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-light hover-warning">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light hover-warning">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-light hover-warning">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="row mt-5">
          <div className="col-12">
            <hr className="border-secondary" />
            <p className="text-center text-light-emphasis mb-0">
              &copy; 2024 Service App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 