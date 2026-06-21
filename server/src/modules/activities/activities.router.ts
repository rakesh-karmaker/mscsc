import express from "express";
import {
  requireMinimumRole,
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
import { ROLES } from "../../shared/utils/roles.js";

const activitiesRouter = express.Router();

// Activity Routes
activitiesRouter.get("/", getAllActivities);
activitiesRouter.get("/get-home-activities", getHomeActivities);
activitiesRouter.get("/:slug", getActivity);

activitiesRouter.post(
  "/",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  createActivity,
);
activitiesRouter.patch(
  "/",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  upload.fields([
    { name: "activityImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
  ]),
  editActivity,
);

activitiesRouter.delete(
  "/",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteActivity,
);

export default activitiesRouter;
