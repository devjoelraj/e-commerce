import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: String,
    password: { type: String, required: false },
    address: String,
    isVerified: { type: Boolean, default: false },
    refreshToken: String,
    otpHash: String,
    otpExpires: Number,
    resetOtpHash: String,
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    resetOtpExpires: Number,
    resetOtpVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
