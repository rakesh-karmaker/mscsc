import { Router } from "express";
import {
  requireMinimumRole,
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
import { ROLES } from "../../../shared/utils/roles.js";

const caApplicationsRouter = Router();

//* event ca application routes

// All GET routes
caApplicationsRouter.get(
  "/:eventSlug",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getAllCAApplications,
);
caApplicationsRouter.get(
  "/:eventSlug/:applicationId",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getCAApplicationById,
);

// POST route for applying for a ca application
caApplicationsRouter.post(
  "/:eventSlug/apply",
  upload.single("photo"),
  applyForCA,
);

// PATCH routes for validating and editing a ca application
caApplicationsRouter.patch(
  "/:eventSlug/:applicationId/status",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editCAApplicationStatus,
);
caApplicationsRouter.patch(
  "/:eventSlug/:applicationId/edit",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editCAApplication,
);

// DELETE route for deleting a ca application
caApplicationsRouter.delete(
  "/:eventSlug/:applicationId",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteCAApplication,
);

export default caApplicationsRouter;
