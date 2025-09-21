import ImageKit from "imagekit";
import config from "./config.js";

// Initialize ImageKit instance for image uploads
const imagekit = new ImageKit({
  publicKey: config.imagekitPublicKey,
  privateKey: config.imagekitPrivateKey,
  urlEndpoint: "https://ik.imagekit.io" + config.imagekitPublicKey,
});

export default imagekit;
