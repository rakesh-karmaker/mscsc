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

const messageRouter = express.Router();

// Message Routes
messageRouter.get("/messages", isAuthorized, isAdmin, getAllMessages);
messageRouter.post("/send-message", sendMessage);
messageRouter.patch(
  "/mark-message-as-read",
  isAuthorized,
  isAdmin,
  markMessageAsRead,
);
messageRouter.delete("/delete-message", isAuthorized, isAdmin, deleteMessage);

export default messageRouter;
