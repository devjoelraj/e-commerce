import React, { useState } from "react";
import "./Login.css";
import OTPInput from "react-otp-input";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Password } = Input;

const Login = () => {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    address: "",
  });

  const [resetPassword, setResetPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = () => {
    console.log("Send OTP to:", email);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    console.log("Verify OTP:", otp);
    setStep(3);
  };

  const handleSignup = (e) => {
    e.preventDefault();

    console.log({
      email,
      ...userData,
    });

    setMode("login");
    setStep(1);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({
      email,
      password: resetPassword.newPassword,
    });

    setMode("login");
    setStep(1);
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

          {/* LOGIN */}
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
                    <input type="checkbox" />
                    Remember me
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

                <button className="auth__button">Sign In</button>
              </form>

              <p className="auth__switch">
                Don't have an account?
                <span
                  onClick={() => {
                    setMode("signup");
                    setStep(1);
                  }}
                >
                  Sign Up
                </span>
              </p>
            </>
          )}

          {/* SIGNUP */}
          {mode === "signup" && (
            <>
              {step === 1 && (
                <>
                  <p className="auth__subtitle">Enter your email</p>

                  <input
                    className="auth__input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button className="auth__button" onClick={handleSendOtp}>
                    Send OTP
                  </button>
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

                  <button className="auth__button" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                </>
              )}

              {step === 3 && (
                <form className="auth__form" onSubmit={handleSignup}>
                  <input
                    className="auth__input"
                    placeholder="Username"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        username: e.target.value,
                      })
                    }
                  />

                  <Password
                    className="auth__password"
                    placeholder="Password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        password: e.target.value,
                      })
                    }
                  />

                  <input
                    className="auth__input"
                    placeholder="Address"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        address: e.target.value,
                      })
                    }
                  />

                  <button className="auth__button">Create Account</button>
                </form>
              )}

              <p className="auth__switch">
                Already have an account?
                <span onClick={() => setMode("login")}>Login</span>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {mode === "forgot" && (
            <>
              {step === 1 && (
                <>
                  <p className="auth__subtitle">Enter your email</p>

                  <input
                    className="auth__input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button className="auth__button" onClick={handleSendOtp}>
                    Send OTP
                  </button>
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

                  <button className="auth__button" onClick={handleVerifyOtp}>
                    Verify OTP
                  </button>
                </>
              )}

              {step === 3 && (
                <form className="auth__form" onSubmit={handleResetPassword}>
                  <Password
                    className="auth__password"
                    placeholder="New Password"
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

                  <button className="auth__button">Reset Password</button>
                </form>
              )}

              <p className="auth__switch">
                Back to
                <span onClick={() => setMode("login")}>Login</span>
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
