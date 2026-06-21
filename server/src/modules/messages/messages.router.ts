import express from "express";
import {
  requireMinimumRole,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";
import {
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
  sendMessage,
} from "./messages.controller.js";
import { ROLES } from "../../shared/utils/roles.js";

const messagesRouter = express.Router();

// Message Routes
messagesRouter.get(
  "/messages",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getAllMessages,
);
messagesRouter.post("/send-message", sendMessage);
messagesRouter.patch(
  "/mark-message-as-read",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  markMessageAsRead,
);
messagesRouter.delete(
  "/delete-message",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  deleteMessage,
);

export default messagesRouter;
