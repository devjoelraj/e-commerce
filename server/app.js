import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { frontendUrl, nodeEnv } from "./src/config/env.config.js";
import { errorHandler, notFound } from "./src/middlewares/errorMiddleware.js";
import { globalLimiter } from "./src/middlewares/rateLimit.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import userRouter from "./src/routes/user.routes.js";
import { clearExpiredCartItems } from "./src/cron/cartExpiry.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "https://e-commerce-psi-liard.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(cookieParser());

if (nodeEnv === "development") {
  app.use(morgan("dev"));
}
// app.use(globalLimiter);
app.use("/auth", authRoutes);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use(notFound);
app.use(errorHandler);

cron.schedule("*/5 * * * *", async () => {
  console.log("🧹 Running cart expiry job...");

  try {
    await clearExpiredCartItems();
  } catch (error) {
    console.error("❌ Cart expiry error:", error.message);
  }
});

export default app;
