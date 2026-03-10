import React from "react";
import "./ContinueButton.css";

const ContinueButton = ({
  onClick,
  text = "Continue",
  disabled = false,
  loading = false,
  style = {},
}) => {
  return (
    <button
      className="continue-btn"
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? <span className="spinner"></span> : text}
    </button>
  );
};

export default ContinueButton;
