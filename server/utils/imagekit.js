const ImageKit = require("imagekit");
const sharp = require("sharp");
const { getDate } = require("./getDate");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io" + process.env.IMAGEKIT_PUBLIC_KEY,
});

// Upload image to ImageKit and return the URL and image ID
const uploadImage = async (res, file) => {
  try {
    const resizedImageBuffer = await sharp(file.buffer)
      .resize({ width: 600, height: 600, fit: "cover" }) // Resize to 600x600
      .webp({ quality: 80 }) // Convert to WebP format
      .toBuffer();

    const uploadedImage = await imagekit.upload({
      file: resizedImageBuffer,
      fileName: `${Date.now()}-${file.originalname}`,
      mimeType: "image/webp",
    });

    const url = uploadedImage.url;

    return { url, imgId: uploadedImage.fileId };
  } catch (err) {
    console.log("Error uploading image - ", getDate(), "\n---\n", err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: err.message });
  }
};

const deleteImage = async (res, imageId) => {
  try {
    imagekit.deleteFile(imageId, (err, result) => {
      if (err) {
        console.log("Error deleting image - ", getDate(), "\n---\n", err);
        return res.status(500).send({ error: "Failed to delete image." });
      }

      console.log("Image deleted successfully -", getDate(), "\n---\n");
    });
  } catch (err) {
    console.log("Error deleting image - ", getDate(), "\n---\n", err);
    return res.status(500).send({ error: "Failed to delete image." });
  }
};

module.exports = { uploadImage, deleteImage };
