import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li>MSI Reward Program</li>
            <li>Member Center</li>
            <li>MSI Insider</li>
            <li>Social Media</li>
            <li>Forums</li>
            <li>ESport Teams</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>Downloads</li>
            <li>Product Registration</li>
            <li>Warranty Information</li>
            <li>Online Customer Service</li>
            <li>Service Location</li>
            <li>Where To Buy</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resource</h4>
          <ul>
            <li>Press Room</li>
            <li>Awards</li>
            <li>Videos</li>
            <li>RSS</li>
            <li>Customer Stories</li>
            <li>Blogs</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company Information</h4>
          <ul>
            <li>Artificial Intelligence</li>
            <li>Brochure</li>
            <li>Wallpaper</li>
            <li>PSU Calculator</li>
          </ul>
        </div>
        <div className="footer-section brand-list">
          <h4>More Brands</h4>
          <ul>
            <li>ASUS</li>
            <li>GIGABYTE</li>
            <li>Razer</li>
            <li>NZXT</li>
            <li>Logitech</li>
            <li>Cooler Master</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Micro-Star INT'L CO., LTD. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Cookie Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Contact Us</a>
          <span>🌐 Global / English</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
