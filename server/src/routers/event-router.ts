import express, { NextFunction, Request, Response } from "express";
import { isAdmin, isAuthorized } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventBySlug,
} from "../controllers/event-controller.js";

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
    name: "videoData",
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
];

// event routes
eventRouter.get("/all", getAllEvents);
eventRouter.get("/:eventSlug", getEventBySlug);
eventRouter.get(
  "/with-registrations/:eventSlug",
  isAuthorized,
  isAdmin,
  (req: Request, _: Response, next: NextFunction) => {
    req.requestDetails = { includeRegistrations: true };
    next();
  },
  getEventBySlug,
);

eventRouter.post(
  "/create",
  isAuthorized,
  isAdmin,
  upload.fields(fileFields),
  createEvent,
);

eventRouter.delete("/delete/:eventSlug", isAuthorized, isAdmin, deleteEvent);

export default eventRouter;
