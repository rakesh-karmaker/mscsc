import { Request, Response } from "express";
import paginateResults from "../lib/paginateResults.js";
import Message from "../models/Message.js";
import { messageSchema } from "../lib/validation/messageScheme.js";

// Get all messages with pagination, sorting, and filtering
export async function getAllMessages(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const nameQuery = Array.isArray(req.query.name)
      ? req.query.name[0]
      : req.query.name;
    const regex = {
      name: new RegExp(nameQuery ? String(nameQuery) : "", "i"),
    };
    const sorted = { sort: { createdAt: -1 as 1 | -1 } };
    const messages = await paginateResults(req, Message, regex, sorted);

    res.status(200).send(messages);
  } catch (err) {
    console.log("Error getting messages - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Send a message (from contact form)
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    // Validate request body against schema
    const { error: validationResult } = messageSchema.validate(req.body);
    if (validationResult) {
      res.status(400).send({
        subject: validationResult.details[0].context?.key,
        message: validationResult.details[0].message,
      });
      return;
    }

    // Create and save the message
    await Message.create(req.body);
    res.status(200).send({ message: "Message sent" });
  } catch (err) {
    console.log("Error sending message - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Mark a message as read
export async function markMessageAsRead(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const messageId = req.body.id;
    if (!messageId || typeof messageId !== "string") {
      res
        .status(400)
        .send({ subject: "id", message: "Message ID is required" });
      return;
    }

    // Update the message's 'new' status to false
    await Message.findByIdAndUpdate(messageId, { new: false });

    res.status(200).send({ message: "Message marked as read" });
  } catch (err) {
    console.log("Error marking message as read - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Delete a message
export async function deleteMessage(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const messageId = req.query.id;
    if (!messageId || typeof messageId !== "string") {
      res
        .status(400)
        .send({ subject: "id", message: "Message ID is required" });
      return;
    }

    // Delete the message
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      res.status(404).send({ message: "Message not found" });
      return;
    }

    res.status(200).send({ message: "Message deleted" });
  } catch (err) {
    console.log("Error deleting message - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
