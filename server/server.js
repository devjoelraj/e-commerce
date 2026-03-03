import app from "./app.js";
import { connectDB } from "./src/config/db.config.js";
import { port } from "./src/config/env.config.js";

connectDB();

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(" Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
