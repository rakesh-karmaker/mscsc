import express, { NextFunction, Request, Response } from "express";
import {
  requireMinimumRole,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";
import upload from "../../../shared/middlewares/multer.js";
import {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventBySlug,
  editEventMeta,
} from "../controllers/events.controller.js";
import { ROLES } from "../../../shared/utils/roles.js";

const eventRouter = express.Router();
const fileFields: { name: string; maxCount: number }[] = [
  {
    name: "eventLogo",
    maxCount: 1,
  },
  {
    name: "eventFavicon",
    maxCount: 1,
  },
  {
    name: "eventBanner",
    maxCount: 1,
  },
  {
    name: "bkashQrCode",
    maxCount: 1,
  },
  {
    name: "nagadQrCode",
    maxCount: 1,
  },
  {
    name: "rocketQrCode",
    maxCount: 1,
  },
  {
    name: "aboutImage",
    maxCount: 1,
  },
  {
    name: "spLogos",
    maxCount: 40,
  },
  {
    name: "segmentTMethodQrs",
    maxCount: 40,
  },
];

// event routes
eventRouter.get("/all", getAllEvents);
eventRouter.get("/:eventSlug", getEventBySlug);
eventRouter.get(
  "/:eventSlug/details",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getEventBySlug,
);
eventRouter.get(
  "/with-registrations/:eventSlug",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  (req: Request, _: Response, next: NextFunction) => {
    req.requestDetails = { includeRegistrations: true };
    next();
  },
  getEventBySlug,
);

eventRouter.post(
  "/create",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  upload.fields(fileFields),
  createEvent,
);

eventRouter.put(
  "/edit/:eventSlug",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  upload.fields(fileFields),
  editEvent,
);

eventRouter.patch(
  "/meta/edit/:eventSlug",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editEventMeta,
);

eventRouter.delete(
  "/delete/:eventSlug",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteEvent,
);

export default eventRouter;
