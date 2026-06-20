import express from "express";
import {
  isAdmin,
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

const tasksRouter = express.Router();

// Task Routes
tasksRouter.get("/", getAllTasks);
tasksRouter.get("/:slug", getTask);
tasksRouter.post("/create", isAuthorized, isAdmin, createTask);
tasksRouter.patch("/edit-task", isAuthorized, isAdmin, editTask);
tasksRouter.delete("/delete-task", isAuthorized, isAdmin, deleteTask);

tasksRouter.post("/submit", isAuthorized, upload.single("poster"), submitTask);
tasksRouter.patch(
  "/edit-submission",
  isAuthorized,
  upload.single("poster"),
  editSubmission,
);
tasksRouter.delete("/delete-submission", isAuthorized, deleteSubmission);

tasksRouter.put("/make-winner", isAuthorized, isAdmin, makeWinner);
tasksRouter.delete("/delete-winner", isAuthorized, isAdmin, removeWinner);

export default tasksRouter;
