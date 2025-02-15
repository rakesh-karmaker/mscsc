require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const originCheckMiddleware = require("./middleware/originCheckMiddleware");
const https = require("https");

const app = express();

// Configure CORS to allow only requests from the specified origin
const corsOptions = {
  origin: process.env.APP_URL || process.env.SERVER_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(originCheckMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// TODO: remove this when in a paid hosting
setInterval(() => {
  const options = {
    hostname: process.env.SERVER_URL.replace(/^https?:\/\//, ""), // Remove protocol if present
    port: 443,
    path: "/",
    method: "GET",
    headers: {
      Origin: process.env.SERVER_URL,
    },
  };

  https.get(options).on("error", (e) => {
    console.error(`Got error: ${e.message}`);
  });
}, 2 * 60 * 1000); // every 2 minutes

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reset-password", require("./routes/resetPasswordRoutes"));
app.use("/api/member", require("./routes/memberRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
