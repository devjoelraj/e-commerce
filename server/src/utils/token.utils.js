import jwt from "jsonwebtoken";
import { accessTokenSecret, refreshTokenSecret } from "../config/env.config.js";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
};
