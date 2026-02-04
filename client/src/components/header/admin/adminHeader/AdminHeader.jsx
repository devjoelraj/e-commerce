import React from "react";
import "./AdminHeader.css"; // Make sure this path is correct

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <img src="/logo.png" alt="logo" className="admin-logo" />
        <p className="admin-company-name">Company Name</p>
        <button className="admin-profile-button">Profile</button>
      </div>
    </header>
  );
};

export default AdminHeader;
