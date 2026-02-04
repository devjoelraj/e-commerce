import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./Login.css";
import { MdEmail, MdPhone } from "react-icons/md";

import maleImg from "../../../assets/onboarding/maleGender.svg";
import femaleImg from "../../../assets/onboarding/femaleGender.svg";
import othersImg from "../../../assets/onboarding/othersGender.svg";
import presentToast from "../../../components/Toast/Toast";
import ContinueButton from "../../../components/buttons/ContinueButton";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signup = location.state?.signup;
  console.log(signup);
  useEffect(() => {
    if (signup) {
      setSignUp(true);
      console.log("object");
      window.history.replaceState({}, document.title);
    }
  }, [signup]);

  const [loginData, setLoginData] = useState({
    emailOrPhone: "email",
    email: "",
    phone: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    gender: "",
    emailOrPhone: "email",
    email: "",
    phone: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [signUp, setSignUp] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedLogin");
    if (remembered) {
      const { emailOrPhone, contact, password } = JSON.parse(remembered);
      setLoginData((prev) => ({
        ...prev,
        emailOrPhone,
        email: emailOrPhone === "email" ? contact : "",
        phone: emailOrPhone === "phone" ? contact : "",
        password,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderSelect = (gender) => {
    setSignupData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const validateEmail = (email) => emailRegex.test(email);
  const validatePhone = (phone) => phoneRegex.test(phone);

  const validateLogin = ({ emailOrPhone, email, phone, password }) => {
    const contact = emailOrPhone === "email" ? email : phone;

    if (!contact) {
      presentToast.error(`Please enter your ${emailOrPhone}.`);
      return false;
    }

    if (!password) {
      presentToast.error("Please enter your password.");
      return false;
    }

    if (emailOrPhone === "email" && !validateEmail(email)) {
      presentToast.error("Please enter a valid email address.");
      return false;
    }

    if (emailOrPhone === "phone" && !validatePhone(phone)) {
      presentToast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  };

  const validateSignup = ({ username, gender, emailOrPhone, email, phone }) => {
    const contact = emailOrPhone === "email" ? email : phone;

    if (!username.trim()) {
      presentToast.error("Please enter your full name.");
      return false;
    }

    if (!gender) {
      presentToast.error("Please select a gender.");
      return false;
    }

    if (!emailOrPhone) {
      presentToast.error("Please choose email or phone for sign up.");
      return false;
    }

    if (!contact) {
      presentToast.error(`Please enter your ${emailOrPhone}.`);
      return false;
    }

    if (emailOrPhone === "email" && !validateEmail(email)) {
      presentToast.error("Please enter a valid email address.");
      return false;
    }

    if (emailOrPhone === "phone" && !validatePhone(phone)) {
      presentToast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signUp) {
      if (validateSignup(signupData)) {
        presentToast.success("Sign-up details are valid. Proceeding to OTP...");
        const contact =
          signupData.emailOrPhone === "email"
            ? signupData.email
            : signupData.phone;
        navigate("/otp", {
          state: { purpose: "signUp", data: contact },
        });
      }
    } else {
      if (validateLogin(loginData)) {
        if (
          loginData.email === "joel@gmail.com" &&
          loginData.password === "123"
        ) {
          presentToast.success("Successfully Login");
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
          presentToast.success("Successfully Login");

          console.log("Login Data", loginData);
        }
      }
    }
  };
  const handleRememberMe = (checked) => {
    setRememberMe(checked);

    if (checked) {
      const contact =
        loginData.emailOrPhone === "email" ? loginData.email : loginData.phone;

      localStorage.setItem(
        "rememberedLogin",
        JSON.stringify({
          emailOrPhone: loginData.emailOrPhone,
          contact,
          password: loginData.password,
        })
      );
    } else {
      localStorage.removeItem("rememberedLogin");
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__visual">
          <div className="login__visual-content">
            {!signUp && <h2 className="login__visual-heading">Welcome Back</h2>}
            <h2 className="login__visual-heading">
              {signUp ? "Create your account" : "Sign in to continue"}
            </h2>
            <p className="login__intro-text">
              {signUp
                ? "Join us and get started in just a few steps."
                : "Log in to access your dashboard and stay connected."}
            </p>
          </div>
        </div>

        <form className="login__form-wrapper" onSubmit={handleSubmit}>
          <h2 className="login__form-title">
            {signUp ? "Sign Up" : "Login to Your Account"}
          </h2>

          {signUp && (
            <>
              <input
                type="text"
                name="username"
                className="login__form-input"
                placeholder="Full Name"
                value={signupData.username}
                onChange={handleSignupChange}
              />

              <div className="login__gender-group">
                <div
                  className={`login__gender-option ${
                    signupData.gender === "male" ? "selected" : ""
                  }`}
                  onClick={() => handleGenderSelect("male")}
                >
                  <img src={maleImg} alt="Male" />
                  <p>Male</p>
                </div>
                <div
                  className={`login__gender-option ${
                    signupData.gender === "female" ? "selected" : ""
                  }`}
                  onClick={() => handleGenderSelect("female")}
                >
                  <img src={femaleImg} alt="Female" />
                  <p>Female</p>
                </div>
                <div
                  className={`login__gender-option ${
                    signupData.gender === "other" ? "selected" : ""
                  }`}
                  onClick={() => handleGenderSelect("other")}
                >
                  <img src={othersImg} alt="Other" />
                  <p>Other</p>
                </div>
              </div>

              <div className="login__email-phone-toggle">
                <label>Choose to sign up with:</label>
                <div className="login__gender-group">
                  <div
                    className={`login__gender-option ${
                      signupData.emailOrPhone === "email" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSignupData({ ...signupData, emailOrPhone: "email" })
                    }
                  >
                    <MdEmail
                      style={{
                        fontSize: "20px",
                        color:
                          signupData.emailOrPhone === "email"
                            ? "#8864f0"
                            : "#888",
                      }}
                    />
                    <p>Email</p>
                  </div>
                  <div
                    className={`login__gender-option ${
                      signupData.emailOrPhone === "phone" ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSignupData({ ...signupData, emailOrPhone: "phone" })
                    }
                  >
                    <MdPhone
                      style={{
                        fontSize: "20px",
                        color:
                          signupData.emailOrPhone === "phone"
                            ? "#8864f0"
                            : "#888",
                      }}
                    />
                    <p>Phone</p>
                  </div>
                </div>
              </div>

              <input
                type={signupData.emailOrPhone === "phone" ? "tel" : "email"}
                inputMode={
                  signupData.emailOrPhone === "phone" ? "numeric" : "text"
                }
                pattern={
                  signupData.emailOrPhone === "phone" ? "[0-9]*" : undefined
                }
                name={signupData.emailOrPhone === "phone" ? "phone" : "email"}
                className="login__form-input"
                placeholder={
                  signupData.emailOrPhone === "phone" ? "Phone Number" : "Email"
                }
                value={
                  signupData.emailOrPhone === "phone"
                    ? signupData.phone
                    : signupData.email
                }
                onChange={handleSignupChange}
              />
            </>
          )}

          {!signUp && (
            <>
              <input
                type={loginData.emailOrPhone === "phone" ? "tel" : "email"}
                inputMode={
                  loginData.emailOrPhone === "phone" ? "numeric" : "text"
                }
                pattern={
                  loginData.emailOrPhone === "phone" ? "[0-9]*" : undefined
                }
                name={loginData.emailOrPhone === "phone" ? "phone" : "email"}
                className="login__form-input"
                placeholder={
                  loginData.emailOrPhone === "phone"
                    ? "Enter your Phone no"
                    : "Enter your Email"
                }
                value={
                  loginData.emailOrPhone === "phone"
                    ? loginData.phone
                    : loginData.email
                }
                onChange={handleLoginChange}
              />

              <Input.Password
                name="password"
                className="login__form-input"
                value={loginData.password}
                onChange={handleLoginChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                placeholder=" password"
              />
              <div className="login__divider" />

              <div
                className="login__icon-preview"
                onClick={() =>
                  setLoginData((prev) => ({
                    ...prev,
                    emailOrPhone:
                      prev.emailOrPhone === "email" ? "phone" : "email",
                  }))
                }
              >
                {loginData.emailOrPhone === "email" ? (
                  <MdPhone style={{ fontSize: "20px" }} />
                ) : (
                  <MdEmail style={{ fontSize: "20px" }} />
                )}
              </div>

              <div className="login__options">
                <label className="login__checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => handleRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <p
                  className="login__forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </p>
              </div>
            </>
          )}

          <ContinueButton type="submit" text={signUp ? "Sign Up" : "Login"} />

          <div className="login__toggle">
            <p>
              {signUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              type="button"
              className="login__toggle-btn"
              onClick={() => {
                setSignUp(!signUp);
                setLoginData({
                  emailOrPhone: "email",
                  email: "",
                  phone: "",
                  password: "",
                });
              }}
            >
              {signUp ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
