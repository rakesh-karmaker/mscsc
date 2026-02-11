import { Request, Response } from "express";
import { eventFormSchema } from "../lib/validation/event-form-schema.js";

// create a new event
export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // validate and parse JSON fields in the request body
    for (const key in body) {
      if (typeof body[key] === "string") {
        try {
          body[key] = JSON.parse(body[key]);
        } catch (err) {
          // If parsing fails, keep the original string value
          res.status(400).send({
            subject: key,
            message: `Invalid JSON format for field ${key}`,
          });
          return;
        }
      }
    }

    const { error: validationError } = eventFormSchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }
  } catch (err) {
    console.log("Error creating event - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
