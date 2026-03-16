import express from "express";
import { errorHandler } from "./shared/middlewares/error-handler.js";
import cors from "cors";
import config from "./shared/config/config.js";
import authRouter from "./modules/auth/auth.router.js";
import forgotPasswordRouter from "./modules/forgot-password/forgot-password.router.js";
import memberRouter from "./modules/members/members.router.js";
import activityRouter from "./modules/activities/activities.router.js";
import messageRouter from "./modules/messages/messages.router.js";
import taskRouter from "./modules/tasks/tasks.router.js";
import dashboardRouter from "./modules/admin/dashboard.router.js";
import eventRouter from "./modules/events/routers/events.router.js";
import eventRegistrationRouter from "./modules/events/routers/event-registrations.router.js";

const app = express();

// Configure CORS to allow only requests from the specified origin
const corsOptions = {
  origin: [config.clientUrl, config.serverUrl, config.event_website_url], //TODO: FIX this
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
app.use("/api/event-registrations", eventRegistrationRouter);

export default app;
