import { Request, Response } from "express";
import Message from "./message.model.js";
import { messageSchema } from "./message.schema.js";

// Get all messages with pagination, sorting, and filtering
export async function getAllMessages(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const params = req.query;

    // Parse and validate query parameters
    const pageNumber = parseInt(params.page as string) || 1;
    const perPage = parseInt(params.perPage as string) || 12;
    const skip = (pageNumber - 1) * perPage;
    const sort: { id: string; desc: boolean } | {} =
      Array.isArray(params.sort) && params.sort.length > 0
        ? params.sort[0]
        : {};
    // Create regex for filtering
    const regex = {
      name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
      email: new RegExp(
        typeof params.email === "string" ? params.email : "",
        "i",
      ),
      source: new RegExp(
        typeof params.source === "string" ? params.source : "",
        "i",
      ),
    };

    // fetch messages based on filters
    const messages = await Message.find(regex)
      .sort(
        sort && Object.keys(sort).length > 0 && "id" in sort && "desc" in sort
          ? { [String(sort.id)]: sort.desc === "true" ? -1 : 1 }
          : { createdAt: -1 },
      )
      .select("-__v -updatedAt");

    const selectedMessageCount = messages.length;
    const paginatedMessages = messages.slice(skip, skip + perPage);

    res.status(200).send({
      results: paginatedMessages,
      selectedCount: selectedMessageCount,
    });
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
  res: Response,
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
  res: Response,
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
