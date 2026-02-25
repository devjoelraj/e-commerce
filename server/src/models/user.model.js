import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
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
    lockUntil: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
