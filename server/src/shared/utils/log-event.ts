import Log from "../models/log.model.js";

export async function logEvent(
  level: "info" | "warning" | "error",
  message: string,
  context: Record<string, any> = {},
) {
  try {
    if (level === "error") {
      console.error(`[${level.toUpperCase()}] ${message}`);
    } else if (level === "warning") {
      console.warn(`[${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }

    await Log.create({ level, message, context });
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}
