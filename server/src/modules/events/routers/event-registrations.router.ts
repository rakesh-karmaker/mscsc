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
  "/:eventSlug/registrations/:registrationId",
  getRegistrationById,
);

// POST route for registering for an event
eventRegistrationRouter.post(
  "/:eventSlug/register",
  upload.single("photo"),
  registerForEvent,
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

// DELETE route for deleting a registration
eventRegistrationRouter.delete(
  "/:eventSlug/registrations/:registrationId",
  isAuthorized,
  isAdmin,
  deleteRegistration,
);

export default eventRegistrationRouter;
