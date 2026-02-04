import React, { useState } from "react";
import "./ForgetPasswords.css";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import presentToast from "../../../../components/Toast/Toast";

const ForgetPasswords = () => {
  const navigate = useNavigate();

  const [recoveryMethod, setRecoveryMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  const handleSendLink = () => {
    const data = recoveryMethod === "email" ? email : number;

    if (!data) {
      presentToast.error(`Please enter your ${recoveryMethod}.`);
      return;
    }

    navigate("/otp", {
      state: { purpose: "forgot", data: recoveryMethod },
    });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <img src="" alt="logo" className="forgot-logo" />

        <h2 className="forgot-title">Recover your password</h2>
        <p className="forgot-text">
          We will send a recovery link to your {recoveryMethod} so that you can
          reset your password and access your account.
        </p>

        <div className="forgot-toggle">
          <p className="forgot-method-label">Choose recovery method:</p>
          <div className="forgot-method-options">
            <button
              className={`forgot-method-btn ${
                recoveryMethod === "email" ? "active" : ""
              }`}
              type="button"
              onClick={() => setRecoveryMethod("email")}
            >
              Email
            </button>
            <button
              className={`forgot-method-btn ${
                recoveryMethod === "phone" ? "active" : ""
              }`}
              type="button"
              onClick={() => setRecoveryMethod("phone")}
            >
              Phone
            </button>
          </div>
        </div>

        {recoveryMethod === "email" ? (
          <>
            <p className="forgot-label">Email</p>
            <input
              type="email"
              className="forgot-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        ) : (
          <>
            <p className="forgot-label">Phone</p>
            <input
              type="tel"
              className="forgot-input"
              placeholder="Enter your phone number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </>
        )}

        <button className="forgot-submit" onClick={handleSendLink}>
          Send Reset Link
        </button>

        <p className="forgot-back" onClick={() => window.history.back()}>
          <MdArrowBack
            style={{ marginRight: "5px", verticalAlign: "middle" }}
          />
          Return to Login
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswords;
