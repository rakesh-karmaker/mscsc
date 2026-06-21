import express from "express";
import {
  requireMinimumRole,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";
import upload from "../../shared/middlewares/multer.js";
import {
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTask,
} from "./controllers/tasks.controller.js";
import {
  deleteSubmission,
  editSubmission,
  makeWinner,
  removeWinner,
  submitTask,
} from "./controllers/task-submissions.controller.js";
import { ROLES } from "../../shared/utils/roles.js";

const tasksRouter = express.Router();

// Task Routes
tasksRouter.get("/", getAllTasks);
tasksRouter.get("/:slug", getTask);
tasksRouter.post(
  "/create",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  createTask,
);
tasksRouter.patch(
  "/edit-task",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editTask,
);
tasksRouter.delete(
  "/delete-task",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteTask,
);

tasksRouter.post("/submit", isAuthorized, upload.single("poster"), submitTask);
tasksRouter.patch(
  "/edit-submission",
  isAuthorized,
  upload.single("poster"),
  editSubmission,
);
tasksRouter.delete(
  "/delete-submission",
  isAuthorized,
  requireMinimumRole(ROLES.MEMBER),
  deleteSubmission,
);

tasksRouter.put(
  "/make-winner",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  makeWinner,
);
tasksRouter.delete(
  "/delete-winner",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  removeWinner,
);

export default tasksRouter;
