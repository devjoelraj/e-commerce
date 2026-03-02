import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED"],
      default: "PENDING",
    },
    otp: String,
    otpExpires: Date,
    lockUntil: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
