require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const originCheckMiddleware = require("./middleware/originCheckMiddleware");

const app = express();

// Configure CORS to allow only requests from the specified origin
const corsOptions = {
  origin: process.env.APP_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(originCheckMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/member", require("./routes/memberRoutes"));
app.use("/api/message", require("./routes/messageRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
