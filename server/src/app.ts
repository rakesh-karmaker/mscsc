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
import caApplicationsRouter from "./modules/events/routers/ca-applications.router.js";
import teamsRouter from "./modules/events/routers/teams.router.js";
import logger from "./shared/config/winston.js";
import morgan from "morgan";
import clubPartnersRouter from "./modules/events/routers/club-partners.router.js";

const app = express();

// Configure CORS to allow only requests from the specified origin
const allowed = [config.clientUrl, config.serverUrl, config.event_website_url];

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const stream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: stream,
  }),
);

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
app.use("/api/ca-applications", caApplicationsRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/club-partners", clubPartnersRouter);

export default app;
