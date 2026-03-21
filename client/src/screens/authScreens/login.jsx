import React, { useState } from "react";
import "./Login.css";
import OTPInput from "react-otp-input";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import presentTost from "../../components/Toast/Toast";
import ContinueButton from "../../components/buttons/ContinueButton";

import {
  completeSignupService,
  sendSignupOtpService,
  verifySignupOtpService,
  loginService,
  sendForgotOtpService,
  verifyForgotOtpService,
  resetPasswordService,
} from "../../api/authScreens/authServices";
import { useNavigate } from "react-router-dom";
import { tokenManager } from "../../api/tokenManager";
import { useAuth } from "../../context/AuthContext";

const { Password } = Input;

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    address: "",
  });
  const [resetPassword, setResetPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateOtp = (otp) => /^\d{6}$/.test(otp);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const validateUsername = (username) => username.trim().length >= 3;

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Send OTP (signup & forgot)
  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      presentTost.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // Choose service based on mode
      const service =
        mode === "signup" ? sendSignupOtpService : sendForgotOtpService;
      const result = await service(email);
      console.log(result, "res");
      if (result?.success) {
        presentTost.success(result.message || "OTP sent successfully");
        setStep(2);
      } else {
        presentTost.error(result?.message || "Failed to send OTP");
      }
    } catch (error) {
      presentTost.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!validateOtp(otp)) {
      presentTost.error("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const service =
        mode === "signup" ? verifySignupOtpService : verifyForgotOtpService;
      const result = await service(email, otp);
      console.log(result, "res");
      if (result?.success) {
        presentTost.success(result.message || "OTP verified successfully");
        setStep(3);
      } else {
        presentTost.error(result?.message || "Failed to verify OTP");
      }
    } catch (error) {
      presentTost.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Complete signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateUsername(userData.username)) {
      presentTost.error("Username must be at least 3 characters");
      return;
    }
    if (!validatePassword(userData.password)) {
      presentTost.error(
        "Password must be at least 8 characters, include uppercase, lowercase, and a number",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await completeSignupService(
        email,
        userData.username,
        userData.password,
        userData.address,
      );
      console.log(result, "res");
      if (result?.success) {
        presentTost.success(result.message || "Account created successfully");
        setMode("login");
        setStep(1);
        setEmail("");
        setOtp("");
        setUserData({ username: "", password: "", address: "" });
      } else {
        presentTost.error(result?.message || "Failed to create account");
      }
    } catch (error) {
      presentTost.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      presentTost.error("Passwords do not match");
      return;
    }
    if (!validatePassword(resetPassword.newPassword)) {
      presentTost.error(
        "Password must be at least 8 characters, include uppercase, lowercase, and a number",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordService(
        email,
        resetPassword.newPassword,
      );
      if (result?.success) {
        presentTost.success(result.message || "Password reset successfully");
        setMode("login");
        setStep(1);
        setEmail("");
        setResetPassword({ newPassword: "", confirmPassword: "" });
      } else {
        presentTost.error(result?.message || "Failed to reset password");
      }
    } catch (error) {
      presentTost.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(loginData.email) || !loginData.password) {
      presentTost.error("Please enter valid email and password");
      return;
    }
    setLoading(true);
    try {
      const result = await loginService(loginData.email, loginData.password);
      if (result?.success) {
        tokenManager.setToken(result.accessToken);
        setAuth(result.accessToken);
        presentTost.success("Login successful");

        const user = tokenManager.getUser();
        if (user?.role === "superadmin") {
          navigate("/admin/admin-dashboard");
        } else if (user?.role === "admin") {
          navigate("/reduce-stock");
        } else {
          navigate("/");
        }
      } else {
        presentTost.error(result?.message || "Login failed");
      }
    } catch (error) {
      presentTost.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__content">
          <h2 className="auth__title">
            {mode === "login"
              ? "Welcome Back"
              : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
          </h2>

          {/* LOGIN MODE */}
          {mode === "login" && (
            <>
              <p className="auth__subtitle">
                Login to continue to your account
              </p>
              <form className="auth__form">
                <input
                  name="email"
                  placeholder="Email"
                  className="auth__input"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
                <Password
                  name="password"
                  className="auth__password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Password"
                />
                <div className="auth__row">
                  <label className="auth__checkbox">
                    <input type="checkbox" /> Remember me
                  </label>
                  <span
                    className="auth__link"
                    onClick={() => {
                      setMode("forgot");
                      setStep(1);
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
                <ContinueButton
                  text="Login"
                  onClick={(e) => handleLogin(e)}
                  loading={loading}
                  disabled={loading}
                />
              </form>
              <p className="auth__switch">
                Don't have an account?
                <span
                  onClick={() => {
                    setMode("signup");
                    setStep(1);
                  }}
                >
                  {" "}
                  Sign Up
                </span>
              </p>
            </>
          )}

          {/* SIGNUP MODE */}
          {mode === "signup" && (
            <>
              {step === 1 && (
                <>
                  <p className="auth__subtitle">Enter your email</p>
                  <input
                    className="auth__input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <ContinueButton
                    text="Send OTP"
                    onClick={handleSendOtp}
                    loading={loading}
                    disabled={loading}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <p className="auth__subtitle">Enter OTP</p>
                  <div className="auth__otp">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => (
                        <input {...props} className="auth__otp-input" />
                      )}
                    />
                  </div>
                  <ContinueButton
                    text="Verify OTP"
                    onClick={handleVerifyOtp}
                    loading={loading}
                    disabled={loading}
                  />
                </>
              )}
              {step === 3 && (
                <form className="auth__form" onSubmit={handleSignup}>
                  <input
                    className="auth__input"
                    placeholder="Username"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                  />
                  <Password
                    className="auth__password"
                    placeholder="Password"
                    value={userData.password}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={(e) =>
                      setUserData({ ...userData, password: e.target.value })
                    }
                  />
                  <input
                    className="auth__input"
                    placeholder="Address"
                    value={userData.address}
                    onChange={(e) =>
                      setUserData({ ...userData, address: e.target.value })
                    }
                  />
                  <ContinueButton
                    text="Create Account"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  />
                </form>
              )}
              <p className="auth__switch">
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>Login</span>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === "forgot" && (
            <>
              {step === 1 && (
                <>
                  <p className="auth__subtitle">Enter your email</p>
                  <input
                    className="auth__input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <ContinueButton
                    text="Send OTP"
                    onClick={handleSendOtp}
                    loading={loading}
                    disabled={loading}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <p className="auth__subtitle">Enter OTP</p>
                  <div className="auth__otp">
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => (
                        <input {...props} className="auth__otp-input" />
                      )}
                    />
                  </div>
                  <ContinueButton
                    text="Verify OTP"
                    onClick={handleVerifyOtp}
                    loading={loading}
                    disabled={loading}
                  />
                </>
              )}
              {step === 3 && (
                <form className="auth__form" onSubmit={handleResetPassword}>
                  <Password
                    className="auth__password"
                    placeholder="New Password"
                    value={resetPassword.newPassword}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={(e) =>
                      setResetPassword({
                        ...resetPassword,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <Password
                    className="auth__password"
                    placeholder="Confirm Password"
                    value={resetPassword.confirmPassword}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={(e) =>
                      setResetPassword({
                        ...resetPassword,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <ContinueButton
                    text="Reset Password"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                  />
                </form>
              )}
              <p className="auth__switch">
                Back to <span onClick={() => setMode("login")}>Login</span>
              </p>
            </>
          )}
        </div>
        <img
          className="auth__image"
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
          alt="auth"
        />
      </div>
    </div>
  );
};

export default Login;
