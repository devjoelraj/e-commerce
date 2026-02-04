import React from "react";
import {
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-flex">
        <div className="footer-col">
          <div className="footer-logo">
            Trendy<span>Style</span>
          </div>
          <div className="footer-address">
            <FaMapMarkerAlt className="location-icon" />
            <span>Chennai, Tamil Nadu</span>
          </div>
          <p className="footer-text">
            Discover the latest trends in fashion with us. Style that suits
            every season.
          </p>
        </div>

        <div className="footer-col-group">
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li className="footer-item">Home</li>
              <li className="footer-item">Shop</li>
              <li className="footer-item">Mens</li>
              <li className="footer-item">Womens</li>
              <li className="footer-item">Trends</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Important Links</h4>
            <ul className="footer-list">
              <li className="footer-item">Privacy Policy</li>
              <li className="footer-item">Return Policy</li>
              <li className="footer-item">Terms & Conditions</li>
              <li className="footer-item">Contact Us</li>
              <li className="footer-item">Support</li>
            </ul>
            <div className="footer-socials">
              <FaFacebookF className="footer-icon" />
              <FaInstagram className="footer-icon" />
              <FaTwitter className="footer-icon" />
              <FaLinkedinIn className="footer-icon" />
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-text">
            Get updates about new collections and offers.
          </p>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 TrendyStyle. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
