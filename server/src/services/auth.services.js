import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/email.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils.js";

const OTP_EXPIRY = 5 * 60 * 1000;
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
      user.loginAttempts = 0;
    }
    await user.save();
    throw new Error("Invalid credentials");
  }

  user.loginAttempts = 0;
  user.lockUntil = null;

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshToken = refreshToken;
  await user.save();

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  };
};

export const refreshTokenService = async ({ refreshToken }) => {
  if (!refreshToken) throw new Error("Refresh token required");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
    console.log("✅ payload:", payload);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async ({ refreshToken }) => {
  if (!refreshToken) throw new Error("Refresh token required");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return { success: true, message: "Logged out" };
  }

  const user = await User.findById(payload.userId);
  if (user && user.refreshToken === refreshToken) {
    user.refreshToken = null;
    await user.save();
  }

  return { success: true, message: "Logged out" };
};

export const sendSignupOtpService = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const existingUser = await User.findOne({ email, isVerified: true });
  if (existingUser) {
    throw new Error("Account already exists");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpExpires = Date.now() + OTP_EXPIRY;

  await User.findOneAndUpdate(
    { email },
    {
      email,
      otpHash,
      otpExpires,
      isVerified: false,
      $unset: { password: 1, username: 1, address: 1 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await sendEmail({
    to: email,
    subject: "Your OTP",
    html: `<p>OTP: ${otp}</p>`,
  });

  return { success: true, message: "OTP sent successfully" };
};

export const verifySignupOtpService = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid request");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOtp !== user.otpHash) throw new Error("Invalid OTP");
  if (Date.now() > user.otpExpires) throw new Error("OTP expired");

  user.isVerified = true;
  user.otpHash = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { success: true, message: "OTP verified successfully" };
};

export const completeSignupService = async ({
  email,
  username,
  password,
  address,
}) => {
  if (!email || !username || !password) {
    throw new Error("Email, username and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Signup session not found");
  if (!user.isVerified) throw new Error("Email not verified");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  user.username = username;
  user.password = passwordHash;
  user.address = address || "";
  await user.save();

  return { success: true, message: "Signup completed successfully" };
};

export const sendForgotOtpService = async ({ email }) => {
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists – but for UX we can say "If account exists, OTP sent"
    throw new Error("No account found with this email");
  }

  // Generate OTP and hash
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const otpExpires = Date.now() + OTP_EXPIRY;

  // Store in reset fields
  user.resetOtpHash = otpHash;
  user.resetOtpExpires = otpExpires;
  user.resetOtpVerified = false; // reset any previous verification
  await user.save();

  // Send email
  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Your OTP for password reset is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });

  return { success: true, message: "OTP sent successfully" };
};

/**
 * Verify OTP for forgot password
 */
export const verifyForgotOtpService = async ({ email, otp }) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOtp !== user.resetOtpHash) throw new Error("Invalid OTP");
  if (Date.now() > user.resetOtpExpires) throw new Error("OTP expired");

  // Mark as verified (so reset endpoint can proceed)
  user.resetOtpVerified = true;
  // Clear OTP fields to prevent reuse
  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  return { success: true, message: "OTP verified successfully" };
};

export const resetPasswordService = async ({ email, newPassword }) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.resetOtpVerified) {
    throw new Error("OTP verification required");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.password = passwordHash;

  user.resetOtpVerified = false;

  await user.save();

  return { success: true, message: "Password reset successfully" };
};
