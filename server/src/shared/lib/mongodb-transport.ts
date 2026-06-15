import Transport from "winston-transport";
import Log from "../models/log.model.js";

class MongoDBTransport extends Transport {
  constructor(opts: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: any, callback: () => void): Promise<void> {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const { level, message, ...context } = info;

    try {
      // Save log to MongoDB
      await Log.create({
        level: level || "info",
        message: message || "",
        context: context || {},
      });
    } catch (error) {
      console.error("Error saving log to MongoDB:", error);
    }
    callback();
  }
}

export default MongoDBTransport;
