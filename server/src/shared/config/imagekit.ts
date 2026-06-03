import ImageKit from "@imagekit/nodejs";
import config from "./config.js";

// Initialize ImageKit instance for image uploads
const imagekit = new ImageKit({
  privateKey: config.imagekitPrivateKey,
});

export default imagekit;
