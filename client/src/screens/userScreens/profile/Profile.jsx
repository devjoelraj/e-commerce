import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCards from "../../../components/productCards/ProductCards";
import Header from "../../../components/header/userHeader/Header";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const storedUser = false;
  const handleLogout = () => {
    navigate("/");
  };
  const handleLogin = () => {
    navigate("/", { state: { signup: true } });
  };

  return (
    <>
      <Header />
      {!user ? (
        <div className="profile-container">
          <div className="profile-header">
            <p className="profile-avatar">JR</p>
            <div>
              <h2>joel</h2>
              <p>joel@gmailcom</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="account-info">
              <p>
                <strong>Name:</strong> joel
              </p>
              <p>
                <strong>Email:</strong> joel@gmailcom
              </p>
              <p>
                <strong>Phone:</strong> +91-9876543210
              </p>
              <p>
                <strong>Address:</strong> 123, Main Street, Chennai
              </p>
            </div>
          </div>

          <div className="profile-section">
            <h3>Recent Orders</h3>
            <div className="flash-deals">
              <div className="card-wrapper">
                <ProductCards />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <h2>You are not logged in</h2>
          <p>Please log in or sign up to view your profile.</p>
          <button onClick={handleLogin} className="login-btn">
            Go to Login / Sign Up
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;
