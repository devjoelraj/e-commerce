import express from "express";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  completeSignupController,
  loginController,
  logoutController,
  refreshTokenController,
  resetPasswordController,
  sendForgotOtpController,
  sendSignupOtpController,
  verifyForgotOtpController,
  verifySignupOtpController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginLimiter, loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

router.post("/signup/send-otp", sendSignupOtpController);
router.post("/signup/verify-otp", verifySignupOtpController);
router.post("/signup/complete", completeSignupController);

router.post("/forgot/send-otp", sendForgotOtpController);
router.post("/forgot/verify-otp", verifyForgotOtpController);
router.post("/forgot/reset-password", resetPasswordController);
export default router;
