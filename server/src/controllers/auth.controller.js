import {
  completeSignupService,
  loginService,
  logoutService,
  refreshTokenService,
  resetPasswordService,
  sendForgotOtpService,
  sendSignupOtpService,
  verifyForgotOtpService,
  verifySignupOtpService,
} from "../services/auth.services.js";

export const sendSignupOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendSignupOtpService({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifySignupOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifySignupOtpService({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const completeSignupController = async (req, res) => {
  try {
    const { email, username, password, address } = req.body;
    const result = await completeSignupService({
      email,
      username,
      password,
      address,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginService({ email, password });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    delete result.refreshToken;

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const refreshTokenController = async (req, res) => {
  console.log("📥 [refreshTokenController] Received request");
  console.log("🍪 Cookies:", req.cookies);
  console.log("📦 Body:", req.body);

  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    console.log("🔑 Token present:", refreshToken ? "yes" : "no");

    if (!refreshToken) {
      console.warn("⚠️ [refreshTokenController] No refresh token");
      return res
        .status(401)
        .json({ success: false, message: "Refresh token missing" });
    }

    console.log("🔄 Calling refreshTokenService...");
    const result = await refreshTokenService({ refreshToken });
    console.log("✅ [refreshTokenController] Service succeeded");

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("🍪 New refresh token cookie set");

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
    });
    console.log("✅ [refreshTokenController] Response sent");
  } catch (error) {
    console.error("❌ [refreshTokenController] Error:", error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    await logoutService({ refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendForgotOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendForgotOtpService({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyForgotOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyForgotOtpService({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await resetPasswordService({ email, newPassword });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
