import React, { useState } from "react";
import { Input, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import "./CreatePassword.css";
import { useLocation } from "react-router-dom";
import presentToast from "../../../components/Toast/Toast";

const CreatePassword = () => {
  const location = useLocation();
  const purpose = location?.state?.purpose || "";
  console.log(purpose);

  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isMinLength = passwordForm.password.length >= 8;
  const hasNumber = /\d/.test(passwordForm.password);
  const hasUpperLower =
    /[a-z]/.test(passwordForm.password) && /[A-Z]/.test(passwordForm.password);

  const passwordsMatch =
    passwordForm.password &&
    passwordForm.confirmPassword &&
    passwordForm.password === passwordForm.confirmPassword;

  const handleSubmit = () => {
    if (!passwordsMatch) {
      presentToast.error("Passwords do not match");
      return;
    }

    if (!isMinLength || !hasNumber || !hasUpperLower) {
      presentToast.error("Password does not meet the strength requirements");
      return;
    }

    presentToast.success("Password successfully created");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        backgroundColor: "#e8dfff",
      }}
    >
      <div className="create-password-container">
        <h2 className="create-password-title">Create New Password</h2>

        <div className="input-group">
          <label className="input-label">New Password</label>
          <Input.Password
            name="password"
            className="password-input"
            value={passwordForm.password}
            onChange={handleInputChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            placeholder="Enter new password"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <Input.Password
            name="confirmPassword"
            className="password-input"
            value={passwordForm.confirmPassword}
            onChange={handleInputChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            placeholder="Confirm your password"
          />
        </div>

        <div className="password-rules">
          <div className="rule">
            {isMinLength ? (
              <CheckCircleFilled className="rule-icon pass" />
            ) : (
              <CloseCircleFilled className="rule-icon fail" />
            )}
            Minimum 8 Characters
          </div>
          <div className="rule">
            {hasNumber ? (
              <CheckCircleFilled className="rule-icon pass" />
            ) : (
              <CloseCircleFilled className="rule-icon fail" />
            )}
            Numbers
          </div>
          <div className="rule">
            {hasUpperLower ? (
              <CheckCircleFilled className="rule-icon pass" />
            ) : (
              <CloseCircleFilled className="rule-icon fail" />
            )}
            Lowercase and Uppercase
          </div>
        </div>

        <Button
          type="primary"
          block
          className="submit-btn"
          onClick={handleSubmit}
        >
          Create Password
        </Button>
      </div>
    </div>
  );
};

export default CreatePassword;
