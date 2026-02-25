import express from "express";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  refreshTokenController,
} from "../controllers/auth.controller.js";
import { logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginLimiter, loginUser);
router.post("refesh", refreshTokenController);
router.post("/logout", protect, logoutUser);

export default router;
