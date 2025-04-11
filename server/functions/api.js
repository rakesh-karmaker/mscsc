// netlify/functions/api.js
const serverless = require("serverless-http");
const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const originCheckMiddleware = require("../middleware/originCheckMiddleware");

// dotenv.config();

const app = express();

// // CORS setup
// const corsOptions = {
//   origin: process.env.APP_URL || process.env.SERVER_URL,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.use(originCheckMiddleware);
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("public"));

// // Connect to MongoDB (connect once per cold start)
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("Mongo Error", err));

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) return;
//   await mongoose.connect(process.env.MONGO_URI);
// };
// await connectDB();

// Routes
// app.use("/api/auth", require("../routes/authRoutes"));
// app.use("/api/reset-password", require("../routes/resetPasswordRoutes"));
// app.use("/api/member", require("../routes/memberRoutes"));
// app.use("/api/message", require("../routes/messageRoutes"));
// app.use("/api/activity", require("../routes/activityRoutes"));
// app.use("/api/task", require("../routes/taskRoutes"));

app.get("/api/", (req, res) => {
  res.json({ message: "hello" });
});

module.exports.handler = serverless(app);
