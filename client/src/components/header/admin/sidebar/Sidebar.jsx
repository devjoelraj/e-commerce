import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="admin-title">Admin</h2>
      <nav className="admin-nav">
        <NavLink
          to="admin-dashboard"
          className="admin-link"
          activeclassname="active"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="admin-AddProduct"
          className="admin-link"
          activeclassname="active"
        >
          Add Product
        </NavLink>

        <NavLink
          to="ordersPage-details"
          className="admin-link"
          activeclassname="active"
        >
          Orders
        </NavLink>
        <NavLink
          to="AllProducts-details"
          className="admin-link"
          activeclassname="active"
        >
          All Products
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
