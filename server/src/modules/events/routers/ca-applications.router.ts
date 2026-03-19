import { Router } from "express";
import {
  isAdmin,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";
import upload from "../../../shared/middlewares/multer.js";
import {
  applyForCA,
  editCAApplicationStatus,
  deleteCAApplication,
  editCAApplication,
  getAllCAApplications,
  getCAApplicationById,
} from "../controllers/ca-applications.controller.js";

const caApplicationsRouter = Router();

//* event ca application routes

// All GET routes
caApplicationsRouter.get(
  "/:eventSlug/ca-applications",
  isAuthorized,
  isAdmin,
  getAllCAApplications,
);
caApplicationsRouter.get(
  "/:eventSlug/ca-applications/:applicationId",
  isAuthorized,
  isAdmin,
  getCAApplicationById,
);

// POST route for applying for a ca application
caApplicationsRouter.post(
  "/:eventSlug/ca-applications/apply",
  upload.single("photo"),
  applyForCA,
);

// PATCH routes for validating and editing a ca application
caApplicationsRouter.patch(
  "/:eventSlug/ca-applications/:applicationId/status",
  isAuthorized,
  isAdmin,
  editCAApplicationStatus,
);
caApplicationsRouter.patch(
  "/:eventSlug/ca-applications/:applicationId/edit",
  isAuthorized,
  isAdmin,
  editCAApplication,
);

// DELETE route for deleting a ca application
caApplicationsRouter.delete(
  "/:eventSlug/ca-applications/:applicationId",
  isAuthorized,
  isAdmin,
  deleteCAApplication,
);

export default caApplicationsRouter;
