import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer.js";
import { createEvent } from "../controllers/event-controller.js";

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

//  event routes
eventRouter.post(
  "/create",
  isAuthorized,
  isAdmin,
  upload.fields(fileFields),
  createEvent,
);
export default eventRouter;
