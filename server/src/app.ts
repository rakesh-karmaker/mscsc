import express from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import cors from "cors";
import config from "./config/config.js";
import authRouter from "./routers/auth-router.js";
import forgotPasswordRouter from "./routers/forgot-password-router.js";
import taskRouter from "./routers/task-router.js";
import memberRouter from "./routers/member-router.js";
import activityRouter from "./routers/activity-router.js";
import messageRouter from "./routers/message-router.js";
import dashboardRouter from "./routers/dashboard-router.js";
import eventRouter from "./routers/event-router.js";

const app = express();

// Configure CORS to allow only requests from the specified origin
const corsOptions = {
  origin: config.clientUrl || config.serverUrl,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(errorHandler);

app.use("/api/auth", authRouter);
app.use("/api/forgot-password", forgotPasswordRouter);

app.use("/api/member", memberRouter);
app.use("/api/activity", activityRouter);

app.use("/api/message", messageRouter);
app.use("/api/task", taskRouter);

app.use("/api/admin", dashboardRouter);
app.use("/api/event", eventRouter);

export default app;
