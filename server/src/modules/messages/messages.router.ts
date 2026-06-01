import express from "express";
import {
  isAdmin,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";
import {
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
  sendMessage,
} from "./messages.controller.js";

const messagesRouter = express.Router();

// Message Routes
messagesRouter.get("/messages", isAuthorized, isAdmin, getAllMessages);
messagesRouter.post("/send-message", sendMessage);
messagesRouter.patch(
  "/mark-message-as-read",
  isAuthorized,
  isAdmin,
  markMessageAsRead,
);
messagesRouter.delete("/delete-message", isAuthorized, isAdmin, deleteMessage);

export default messagesRouter;
