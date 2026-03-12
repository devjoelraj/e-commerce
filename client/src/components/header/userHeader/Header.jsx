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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const navItems = ["Home", "Deals", "All", "Shirts", "Pants"];

  const sidebarItems = [
    "Home",
    "Deals",
    "All",
    "Shirts",
    "Pants",
    "Accessories",
    "footwears",
  ];

  const dropdownSections = {
    footwears: ["shoe", "slipper"],
    Accessories: ["watch", "chain", "ring"],
  };

  const handleNavigation = (item) => {
    setSidebarOpen(false);
    setOpenSection(null);

    if (item.includes(" - ")) {
      const [section, category] = item.split(" - ");

      const mainCategory =
        section.toLowerCase() === "footwears" ? "Footwear" : section;

      navigate("/ProductLists", {
        state: {
          category: mainCategory,
          type: category.toLowerCase(),
        },
      });

      return;
    }

    switch (item) {
      case "Home":
        navigate("/");
        break;

      case "Deals":
        navigate("/productLists", { state: { category: "Deals" } });
        break;

      case "All":
        navigate("/ProductLists", {
          state: { category: "All" },
        });
        break;

      default:
        navigate("/ProductLists", {
          state: { category: item },
        });
    }
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
        <img
          src="/logo.png"
          alt="logo"
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

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
              location.pathname === "/watchlist" ? "active-cart" : ""
            }`}
            title="Wishlist"
            onClick={() => navigate("/watchlist")}
          />

          <FaShoppingCart
            className={`icon ${
              location.pathname === "/add-to-cart" ? "active-cart" : ""
            }`}
            title="Cart"
            onClick={() => navigate("/AddToCart")}
          />

          <FaUserCircle
            className={`icon ${
              location.pathname === "/profile" ? "active-cart" : ""
            }`}
            title="Profile"
            onClick={() => navigate("/profile")}
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

          {sidebarItems.map((item) =>
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
                  <div className="accordion-content">
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
            ),
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
