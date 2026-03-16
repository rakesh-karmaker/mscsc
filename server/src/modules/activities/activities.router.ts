import express from "express";
import {
  isAdmin,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";
import upload from "../../shared/middlewares/multer.js";
import {
  createActivity,
  deleteActivity,
  editActivity,
  getActivity,
  getAllActivities,
  getHomeActivities,
} from "./activities.controller.js";

const activityRouter = express.Router();

// Activity Routes
activityRouter.get("/", getAllActivities);
activityRouter.get("/get-home-activities", getHomeActivities);
activityRouter.get("/:slug", getActivity);

activityRouter.post(
  "/",
  isAuthorized,
  isAdmin,
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  createActivity,
);
activityRouter.patch(
  "/",
  isAuthorized,
  isAdmin,
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  editActivity,
);

activityRouter.delete("/", isAuthorized, isAdmin, deleteActivity);

export default activityRouter;
