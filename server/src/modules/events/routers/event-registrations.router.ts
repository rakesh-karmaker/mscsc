import e, { Router } from "express";
import {
  deleteRegistration,
  editRegistration,
  getAllEventRegistrations,
  getRegistrationById,
  registerForEvent,
  changeRegistrationStatus,
} from "../controllers/event-registrations.controller.js";
import {
  isAdmin,
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
} from "../controllers/segments.controller.js";

const eventRegistrationRouter = Router();

//* event registration routes

// All GET routes
eventRegistrationRouter.get(
  "/:eventSlug/registrations",
  isAuthorized,
  isAdmin,
  getAllEventRegistrations,
);

eventRegistrationRouter.get(
  "/:eventSlug/registrations/get-data",
  isAuthorized,
  getRegistrationData,
);

eventRegistrationRouter.get(
  "/:eventSlug/registrations/:registrationId",
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
  isAdmin,
  changeRegistrationStatus,
);
eventRegistrationRouter.patch(
  "/:eventSlug/registrations/:registrationId/edit",
  isAuthorized,
  isAdmin,
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

// DELETE route for deleting a registration
eventRegistrationRouter.delete(
  "/:eventSlug/registrations/:registrationId",
  isAuthorized,
  isAdmin,
  deleteRegistration,
);

export default eventRegistrationRouter;
