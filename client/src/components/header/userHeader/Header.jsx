import React, { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ scrollToDeals }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const navItems = ["All", "Deals", "Mens", "Womens", "Trends"];

  const dropdownSections = {
    Mens: ["Shirts", "Shoes", "Accessories"],
    Womens: ["Dresses", "Bags", "Heels"],
  };

  const handleNavigation = (item) => {
    const lowerItem = item.toLowerCase();

    if (item === "Deals") {
      navigate("/user-dashboard", { state: { scrollToDeals: true } });
    } else if (item === "Trends") {
      navigate("/ProductLists", { state: { data: item } });
    } else if (item === "All") {
      navigate("/user-dashboard");
    } else if (lowerItem === "mens" || lowerItem === "womens") {
      navigate("/ProductLists", { state: { data: item } });
    } else if (item.includes(" - ")) {
      const [section, category] = item.split(" - ");
      navigate("/ProductLists", { state: { data: section, category } });
    }

    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setOpenSection(null);
  };

  const toggleDropdown = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <header className="header">
      <div className="top-nav">
        <img src="/logo.png" alt="logo" className="logo" />
        <div className="search-wrapper">
          <input
            type="text"
            name="search"
            placeholder="Search for products"
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="icons-wrapper">
          <FaHeart
            className={`icon ${
              location.pathname === "/WatchList" ? "active-cart" : ""
            }`}
            title="Wishlist"
            onClick={() => navigate("/WatchList")}
          />
          <FaShoppingCart
            className={`icon ${
              location.pathname === "/AddToCart" ? "active-cart" : ""
            }`}
            title="Cart"
            onClick={() => navigate("/AddToCart")}
          />
          <FaUserCircle
            className={`icon ${
              location.pathname === "/Profile" ? "active-cart" : ""
            }`}
            title="Profile"
            onClick={() => navigate("/Profile")}
          />
        </div>
      </div>

      <div className="bottom-nav">
        <FaBars className="burger-icon" onClick={toggleSidebar} />
        {navItems.map((item) => (
          <span
            key={item}
            className="nav-item"
            onClick={() => handleNavigation(item)}
          >
            {item}
          </span>
        ))}
      </div>

      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <FaTimes className="close-icon" onClick={toggleSidebar} />
            <h3>Categories</h3>
          </div>

          {navItems.map((item) =>
            dropdownSections[item] ? (
              <div key={item} className="sidebar-section has-dropdown">
                <div
                  className="accordion-header"
                  onClick={() => toggleDropdown(item)}
                >
                  {item}
                  {openSection === item ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openSection === item && (
                  <div
                    className="accordion-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {dropdownSections[item].map((subItem) => (
                      <p
                        key={subItem}
                        onClick={() => handleNavigation(`${item} - ${subItem}`)}
                      >
                        {subItem}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                key={item}
                className="sidebar-section"
                onClick={() => handleNavigation(item)}
              >
                {item}
              </div>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
