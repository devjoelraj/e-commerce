import app from "./app.js";
import { connectDB } from "./src/config/db.config.js";
import { port } from "./src/config/env.config.js";

connectDB();

const PORT = port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("💥 Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
