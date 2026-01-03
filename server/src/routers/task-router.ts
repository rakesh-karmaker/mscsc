import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer.js";
import {
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  getTask,
} from "../controllers/task-controller.js";
import {
  deleteSubmission,
  editSubmission,
  makeWinner,
  removeWinner,
  submitTask,
} from "../controllers/task-submission-controller.js";

const taskRouter = express.Router();

// Task Routes
taskRouter.get("/", getAllTasks);
taskRouter.get("/:slug", getTask);
taskRouter.post("/create", isAuthorized, isAdmin, createTask);
taskRouter.patch("/edit-task", isAuthorized, isAdmin, editTask);
taskRouter.delete("/delete-task", isAuthorized, isAdmin, deleteTask);

taskRouter.post("/submit", isAuthorized, upload.single("poster"), submitTask);
taskRouter.patch(
  "/edit-submission",
  isAuthorized,
  upload.single("poster"),
  editSubmission
);
taskRouter.delete("/delete-submission", isAuthorized, deleteSubmission);

taskRouter.put("/make-winner", isAuthorized, isAdmin, makeWinner);
taskRouter.delete("/delete-winner", isAuthorized, isAdmin, removeWinner);

export default taskRouter;
