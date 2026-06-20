import sharp from "sharp";
import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";
import logger from "../config/winston.js";

// Upload image to ImageKit and return the URL and image ID
export async function uploadImage(
  file: Express.Multer.File,
  crop: boolean = false,
  folder: string = "",
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
    const uploadedImage = await imagekit.files.upload({
      file: await toFile(
        resizedImageBuffer,
        `${Date.now()}-${file.originalname}`,
      ),
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
    });

    if (!uploadedImage || !uploadedImage.url || !uploadedImage.fileId) {
      throw new Error("Invalid response from ImageKit");
    }

    logger.info(`Image uploaded successfully - ${uploadedImage.url}`, {
      url: uploadedImage.url,
      imgId: uploadedImage.fileId,
    });

    return { url: uploadedImage.url, imgId: uploadedImage.fileId };
  } catch (err) {
    logger.error("Error uploading image - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error("Image upload failed");
  }
}

// Upload multiple images to ImageKit and return the URLs and image IDs
export async function uploadMultipleImages(
  files: Express.Multer.File[],
  folder: string = "",
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

        const uploadedImage = await imagekit.files.upload({
          file: await toFile(
            convertedImageBuffer,
            `${Date.now()}-${file.originalname}-${Math.floor(
              Math.random() * 1000,
            )}`,
          ),
          fileName: `${Date.now()}-${file.originalname}-${Math.floor(
            Math.random() * 1000,
          )}`,
          folder: folder,
        });

        return { url: uploadedImage.url, imgId: uploadedImage.fileId };
      }),
    );

    // create an array of objects with url and imgId
    const gallery = uploadedImages.map((image) => ({
      url: image.url as string,
      imgId: image.imgId as string,
    }));

    logger.info(`Multiple images uploaded successfully - `, {
      gallery,
    });

    return gallery;
  } catch (err) {
    logger.error("Error uploading images - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error("Image upload failed");
  }
}

// upload video to ImageKit and return the URL and video ID
export async function uploadVideo(
  file: Express.Multer.File,
  folder: string = "",
): Promise<{ url: string; videoId: string }> {
  try {
    const uploadedVideo = await imagekit.files.upload({
      file: await toFile(file.buffer, `${Date.now()}-${file.originalname}`),
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
    });

    if (!uploadedVideo || !uploadedVideo.url || !uploadedVideo.fileId) {
      throw new Error("Invalid response from ImageKit");
    }

    logger.info(`Video uploaded successfully - ${uploadedVideo.url}`, {
      url: uploadedVideo.url,
      videoId: uploadedVideo.fileId,
    });

    return { url: uploadedVideo.url, videoId: uploadedVideo.fileId };
  } catch (err) {
    logger.error("Error uploading video - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error("Video upload failed");
  }
}

// Upload json file to ImageKit and return the URL and image ID
export async function uploadJsonFile(
  jsonData: object,
  fileName: string,
  folder: string,
): Promise<{ url: string; jsonPublicId: string }> {
  try {
    const jsonString = JSON.stringify(jsonData);
    const buffer = Buffer.from(jsonString, "utf-8");
    const uploadedFile = await imagekit.files.upload({
      file: await toFile(buffer, `${Date.now()}-${fileName}.json`),
      fileName: `${Date.now()}-${fileName}.json`,
      folder: folder,
    });
    if (!uploadedFile || !uploadedFile.url || !uploadedFile.fileId) {
      throw new Error("Invalid response from ImageKit");
    }

    logger.info(`JSON file uploaded successfully - ${uploadedFile.url}`, {
      url: uploadedFile.url,
      jsonPublicId: uploadedFile.fileId,
    });

    return { url: uploadedFile.url, jsonPublicId: uploadedFile.fileId };
  } catch (err) {
    logger.error("Error uploading JSON file - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error("JSON file upload failed");
  }
}

// rename folder in ImageKit
export async function renameFolder(
  oldFolderPath: string,
  newFolderName: string,
) {
  try {
    // Create a new folder with the new name
    await imagekit.folders.rename({
      folderPath: oldFolderPath,
      newFolderName: newFolderName,
    });

    logger.info(`Folder renamed successfully - ${newFolderName}`, {
      oldFolderPath,
      newFolderName,
    });
  } catch (err) {
    logger.error("Error renaming folder - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      oldFolderPath,
      newFolderName,
    });
    throw new Error("Failed to rename folder.");
  }
}

// Delete file from ImageKit using the file ID
export async function deleteFile(fileId: string) {
  try {
    // Delete the file from ImageKit
    await imagekit.files.delete(fileId);
    logger.info("File deleted successfully", {
      fileId,
    });
  } catch (err: any) {
    // If the error is a 404, it means the file was not found in ImageKit, which can happen if it was already deleted. We can log this and continue without throwing an error.
    if (err?.status && err.status?.toString() === "404") {
      logger.info("File not found in ImageKit", {
        fileId,
      });
    } else {
      logger.error("Error deleting file", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        fileId,
      });
      throw new Error("Failed to delete file.");
    }
  }
}

// Delete folder
export async function deleteFolder(folderPath: string) {
  try {
    await imagekit.folders.delete({
      folderPath: folderPath,
    });
    logger.info("Folder deleted successfully", {
      folderPath,
    });
  } catch (err) {
    logger.error("Error deleting folder - ", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      folderPath,
    });
    throw new Error("Failed to delete folder.");
  }
}
