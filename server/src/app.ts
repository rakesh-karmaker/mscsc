import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";
import config from "./config/config.js";
import authRouter from "./routers/authRouter.js";
import forgotPasswordRouter from "./routers/forgotPasswordRouter.js";
import taskRouter from "./routers/taskRouter.js";
import memberRouter from "./routers/memberRouter.js";
import activityRouter from "./routers/activityRouter.js";
import messageRouter from "./routers/messageRouter.js";

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

export default app;
