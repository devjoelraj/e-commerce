import React from "react";
import "./ContinueButton.css";

const ContinueButton = ({
  onClick,
  text = "Continue",
  disabled = false,
  loading = false,
  style = {},
  type = "button",
}) => {
  return (
    <button
      className="continue-btn"
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      type={type}
    >
      {loading ? <span className="spinner"></span> : text}
    </button>
  );
};

export default ContinueButton;
