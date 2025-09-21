import express from "express";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Message Routes
messageRouter.get("/get-message", isAuthorized, isAdmin, getAllMessages);
messageRouter.post("/send-message", sendMessage);
messageRouter.patch(
  "/mark-message-as-read",
  isAuthorized,
  isAdmin,
  markMessageAsRead
);
messageRouter.delete("/delete-message", isAuthorized, isAdmin, deleteMessage);

export default messageRouter;
