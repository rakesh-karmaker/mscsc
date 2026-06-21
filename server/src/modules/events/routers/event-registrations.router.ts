import { Router } from "express";
import {
  deleteRegistration,
  editRegistration,
  getAllEventRegistrations,
  getRegistrationById,
  registerForEvent,
  changeRegistrationStatus,
} from "../controllers/event-registrations.controller.js";
import {
  requireMinimumRole,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";
import upload from "../../../shared/middlewares/multer.js";
import {
  getRegistrationData,
  loginParticipant,
} from "../controllers/event-auth.controller.js";
import {
  addFreeSoloSegment,
  addPaidSoloSegment,
  changePaidSoloSegmentStatus,
} from "../controllers/segments.controller.js";
import { ROLES } from "../../../shared/utils/roles.js";

const eventRegistrationRouter = Router();

//* event registration routes

// All GET routes
eventRegistrationRouter.get(
  "/:eventSlug/registrations",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getAllEventRegistrations,
);

eventRegistrationRouter.get(
  "/:eventSlug/registrations/get-data",
  isAuthorized,
  getRegistrationData,
);

eventRegistrationRouter.get(
  "/:eventSlug/registrations/:registrationId",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getRegistrationById,
);

// POST route for registering for an event
eventRegistrationRouter.post(
  "/:eventSlug/register",
  upload.single("photo"),
  registerForEvent,
);

eventRegistrationRouter.post(
  "/:eventSlug/registrations/login",
  loginParticipant,
);

// PATCH routes for validating and editing a registration
eventRegistrationRouter.patch(
  "/:eventSlug/registrations/:registrationId/status",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  changeRegistrationStatus,
);
eventRegistrationRouter.patch(
  "/:eventSlug/registrations/:registrationId/edit",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editRegistration,
);

eventRegistrationRouter.patch(
  "/:eventSlug/registrations/add-free-solo-segment",
  isAuthorized,
  addFreeSoloSegment,
);
eventRegistrationRouter.patch(
  "/:eventSlug/registrations/add-paid-solo-segment",
  isAuthorized,
  addPaidSoloSegment,
);
eventRegistrationRouter.patch(
  "/:eventSlug/:registrationId/:segmentSlug/change-paid-solo-segment-status",
  isAuthorized,
  changePaidSoloSegmentStatus,
);

// DELETE route for deleting a registration
eventRegistrationRouter.delete(
  "/:eventSlug/registrations/:registrationId",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteRegistration,
);

export default eventRegistrationRouter;
