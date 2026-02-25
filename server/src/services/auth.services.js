import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";
import { refreshTokenSecret } from "../config/env.config.js";

export const loginService = async ({ identifier, password }) => {
  if (!identifier || !password) {
    throw new Error("Invalid credentials");
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ email: normalizedIdentifier }, { phone: normalizedIdentifier }],
  });

  if (!user) throw new Error("Invalid credentials");

  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new Error("Account temporarily locked");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.loginAttempts += 1;

    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
    }

    await user.save();
    throw new Error("Invalid credentials");
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw new Error("Unauthorized");

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, refreshTokenSecret);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.refreshToken) {
    throw new Error("Unauthorized");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  if (hashedToken !== user.refreshToken) {
    user.refreshToken = null;
    await user.save();
    throw new Error("Token reuse detected. Please login again.");
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const newHashedToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  user.refreshToken = newHashedToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  user.refreshToken = null;
  await user.save();
};
