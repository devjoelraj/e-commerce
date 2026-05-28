import apiClient from "../apiClient";

export const sendSignupOtpService = async (email) => {
  if (!email) throw new Error("Email is required");
  try {
    const response = await apiClient.post("/auth/signup/send-otp", { email });
    if (response?.status === 200) {
      return response?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to send OTP");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to send OTP");
  }
};

export const verifySignupOtpService = async (email, otp) => {
  if (!email || !otp) throw new Error("Email and OTP are required");
  try {
    const response = await apiClient.post("/auth/signup/verify-otp", {
      email,
      otp,
    });
    if (response?.status === 200) {
      return response?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to verify OTP");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to verify OTP");
  }
};

export const completeSignupService = async (
  email,
  username,
  password,
  address,
) => {
  if (!email || !username || !password)
    throw new Error("Email, username and password are required");
  try {
    const response = await apiClient.post("/auth/signup/complete", {
      email,
      username,
      password,
      address,
    });
    if (response?.status === 201) {
      return response?.data;
    } else {
      throw new Error(response?.data?.message || "Failed to complete signup");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to complete signup");
  }
};

export const resetPasswordService = async (email, newPassword) => {
  if (!email || !newPassword)
    throw new Error("Email and new password are required");
  try {
    const response = await apiClient.post("/auth/forgot/reset-password", {
      email,
      newPassword,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to reset password",
    );
  }
};

export const verifyForgotOtpService = async (email, otp) => {
  if (!email || !otp) throw new Error("Email and OTP  are required");
  try {
    const response = await apiClient.post("/auth/forgot/verify-otp", {
      email,
      otp,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to verify forgot OTP",
    );
  }
};

export const sendForgotOtpService = async (email) => {
  if (!email) throw new Error("Email is required");
  try {
    const response = await apiClient.post("/auth/forgot/send-otp", {
      email,
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to send forgot OTP",
    );
  }
};

export const loginService = async (email, password) => {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    return res?.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to login",
    );
  }
};
