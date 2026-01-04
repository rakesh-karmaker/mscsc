import sharp from "sharp";
import imagekit from "../config/imagekit.js";
import getDate from "../utils/get-date.js";

// Upload image to ImageKit and return the URL and image ID
export async function uploadImage(
  file: Express.Multer.File,
  crop: boolean = false
): Promise<{ url: string; imgId: string }> {
  try {
    let resizedImageBuffer;

    // Resize if needed and convert image to WebP format using Sharp
    if (!crop) {
      resizedImageBuffer = await sharp(file.buffer)
        .webp({ quality: 80 }) // Convert to WebP format
        .toBuffer();
    } else {
      resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 600, height: 600, fit: "cover" }) // Resize to 600x600
        .webp({ quality: 80 }) // Convert to WebP format
        .toBuffer();
    }

    // Upload the processed image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: resizedImageBuffer,
      fileName: `${Date.now()}-${file.originalname}`,
    });

    return { url: uploadedImage.url, imgId: uploadedImage.fileId };
  } catch (err) {
    console.log("Error uploading image - ", getDate(), "\n---\n", err);
    throw new Error("Image upload failed");
  }
}

// Upload multiple images to ImageKit and return the URLs and image IDs
export async function uploadMultipleImages(
  files: Express.Multer.File[]
): Promise<{ url: string; imgId: string }[]> {
  try {
    if (files.length === 0) {
      throw new Error("No files provided for upload");
    }

    // upload all images concurrently
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const convertedImageBuffer = await sharp(file.buffer)
          .webp({ quality: 80 }) // Convert to WebP format
          .toBuffer();

        const uploadedImage = await imagekit.upload({
          file: convertedImageBuffer,
          fileName: `${Date.now()}-${file.originalname}-${Math.floor(
            Math.random() * 1000
          )}`,
        });

        return { url: uploadedImage.url, imgId: uploadedImage.fileId };
      })
    );

    // create an array of objects with url and imgId
    const gallery = uploadedImages.map((image) => ({
      url: image.url,
      imgId: image.imgId,
    }));

    return gallery;
  } catch (err) {
    console.log("Error uploading images - ", getDate(), "\n---\n", err);
    throw new Error("Image upload failed");
  }
}

// Delete image from ImageKit using the image ID
export function deleteImage(imageId: string) {
  try {
    // Delete the image from ImageKit
    imagekit.deleteFile(imageId, (err, _) => {
      if (err) {
        console.log("Error deleting image - ", getDate(), "\n---\n", err);
        throw new Error("Failed to delete image.");
      }

      console.log("Image deleted successfully -", getDate(), "\n---\n");
    });
  } catch (err) {
    console.log("Error deleting image - ", getDate(), "\n---\n", err);
    throw new Error("Failed to delete image.");
  }
}
