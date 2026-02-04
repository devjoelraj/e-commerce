import React, { useState } from "react";
import OTPInput from "react-otp-input";
import "./Otp.css";
import otpImg from "../../../assets/onboarding/OTP.png";
import { useLocation, useNavigate } from "react-router-dom";
import presentToast from "../../../components/Toast/Toast";

const Otp = () => {
  const navigation = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");

  const purpose = location?.state?.purpose || "";
  const data = location?.state?.data || "";

  console.log(purpose, "purpose");
  console.log(data);
  console.log("OTP entered:", otp);

  const handleVerify = () => {
    if (otp.length !== 6) {
      presentToast.error("Please enter the complete 6-digit OTP");
      return;
    }

    navigation("/create-password", {
      state: { purpose: purpose },
    });
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <img src={otpImg} alt="OTP Visual" />
        <h2 className="otp-heading">
          {purpose === "forgot"
            ? "Reset Password Verification"
            : "Verification Code"}
        </h2>
        <p className="otp-subtext">
          {purpose === "forgot"
            ? `Please enter the verification code sent to your ${
                data === "phone" ? "phone" : "email"
              } to reset your password`
            : `Enter the 6-digit code we sent to your ${
                data === "phone" ? "phone" : "email"
              }`}
        </p>

        <div className="otp-input-group">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props, index) => (
              <input {...props} autoFocus={index === 0} className="otp-input" />
            )}
          />
        </div>

        <button className="otp-submit-btn" onClick={handleVerify}>
          Verify
        </button>

        <p className="otp-resend">
          Didn’t receive the code? <span>Resend</span>
        </p>
      </div>
    </div>
  );
};

export default Otp;
