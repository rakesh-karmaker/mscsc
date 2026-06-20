import dotenv from "dotenv";
dotenv.config();

interface Config {
  // General
  nodeEnv: string;
  port: number;
  forceDNSChange: boolean;

  // Database
  mongoUrl: string;

  // URLs
  serverUrl: string;
  serverIp: string;
  clientUrl: string;
  event_website_url: string;

  // ImageKit
  imagekitPrivateKey: string;

  // JWT
  jwtSecret: string;

  // Mail Service
  mailServerUrl: string;
  email: string;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  forceDNSChange: process.env.FORCE_DNS_CHANGE === "true" || false,

  serverUrl: process.env.SERVER_URL || "",
  serverIp: process.env.SERVER_IP || "",
  clientUrl: process.env.CLIENT_URL || "",
  event_website_url: process.env.EVENT_WEBSITE_URL || "",

  mongoUrl: process.env.MONGO_URL || "",

  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",

  jwtSecret: process.env.JWT_SECRET || "",

  mailServerUrl: process.env.MAIL_SERVER_URL || "",
  email: process.env.EMAIL || "",
};

export default config;
