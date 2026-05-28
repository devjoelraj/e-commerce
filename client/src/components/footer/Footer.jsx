import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path, state = {}) => {
    navigate(path, { state });
  };

  const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const socialLinks = [
    { icon: FaFacebookF, url: "https://facebook.com" },
    { icon: FaInstagram, url: "https://instagram.com" },
    { icon: FaTwitter, url: "https://twitter.com" },
    { icon: FaLinkedinIn, url: "https://linkedin.com" },
  ];

  const importantLinks = [
    { label: "Privacy Policy", path: "/important/privacy" },
    { label: "Return Policy", path: "/important/returns" },
    { label: "Terms & Conditions", path: "/important/terms" },
    { label: "Contact Us", path: "/important/contact" },
    { label: "Support", path: "/important/support" },
  ];

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
              <li className="footer-item" onClick={() => handleNavigation("/")}>
                Home
              </li>
              <li
                className="footer-item"
                onClick={() =>
                  handleNavigation("/ProductLists", { category: "All" })
                }
              >
                All
              </li>
              <li
                className="footer-item"
                onClick={() =>
                  handleNavigation("/ProductLists", { category: "Shirts" })
                }
              >
                Shirts
              </li>
              <li
                className="footer-item"
                onClick={() =>
                  handleNavigation("/ProductLists", { category: "Pants" })
                }
              >
                Pants
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Important Links</h4>
            <ul className="footer-list">
              {importantLinks.map((link) => (
                <li
                  key={link.label}
                  className="footer-item"
                  onClick={() => handleNavigation(link.path)}
                >
                  {link.label}
                </li>
              ))}
            </ul>
            <div className="footer-socials">
              {socialLinks.map((social, idx) => (
                <social.icon
                  key={idx}
                  className="footer-icon"
                  onClick={() => handleSocialClick(social.url)}
                />
              ))}
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
