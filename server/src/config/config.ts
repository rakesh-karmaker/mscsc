import dotenv from "dotenv";
dotenv.config();

interface Config {
  // General
  nodeEnv: string;
  port: number;

  // Database
  mongoUrl: string;

  // URLs
  serverUrl: string;
  serverIp: string;
  clientUrl: string;

  // ImageKit
  imagekitPublicKey: string;
  imagekitPrivateKey: string;
  imagekitId: string;

  // JWT
  jwtSecret: string;

  // Mail Service
  mailAddress: string;
  mailPass: string;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  serverUrl: process.env.SERVER_URL || "",
  serverIp: process.env.SERVER_IP || "",
  clientUrl: process.env.CLIENT_URL || "",

  mongoUrl: process.env.MONGO_URL || "",

  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  imagekitId: process.env.IMAGEKIT_ID || "",

  jwtSecret: process.env.JWT_SECRET || "",

  mailAddress: process.env.MAIL_ADDRESS || "",
  mailPass: process.env.MAIL_PASS || "",
};

export default config;
