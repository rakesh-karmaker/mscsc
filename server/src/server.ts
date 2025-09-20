import app from "./app.js";
import config from "./config/config.js";
import mongoose from "mongoose";
import { verifyConnection } from "./config/mailSender.js";
mongoose
  .connect(config.mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Verify email connection asynchronously (don't block server startup)
verifyConnection().catch((error) => {
  console.error("Email verification failed:", error.message);
  console.log("Server will continue without email functionality");
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
