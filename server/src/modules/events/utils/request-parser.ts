import { Response } from "express";

export function parseRequestBodyJson(body: any, res: Response): boolean {
  for (const key in body) {
    if (typeof body[key] === "string") {
      try {
        body[key] = JSON.parse(body[key]);
      } catch (err) {
        res.status(400).send({
          subject: key,
          message: `Invalid JSON format for field ${key}`,
        });
        return false;
      }
    }
  }
  return true;
}

export function validateBodySchema(
  schema: any,
  body: any,
  res: Response,
): boolean {
  const { error } = schema.validate(body);
  if (error) {
    res.status(400).send({
      subject: error.details[0].context?.key,
      message: error.details[0].message,
    });
    return false;
  }
  return true;
}
