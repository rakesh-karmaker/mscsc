import { Request, Response } from "express";
import paginateResults from "../lib/paginate-results.js";
import Activity from "../models/Activity.js";
import generateSlug from "../utils/generate-slug.js";
import {
  deleteFile,
  uploadImage,
  uploadMultipleImages,
} from "../lib/file-uploader.js";
import { activitySchema } from "../lib/validation/activity-schema.js";

// Get all activities
export async function getAllActivities(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Create regex for filtering
    const regex = {
      title: new RegExp(
        typeof req.query.title === "string" ? req.query.title : "",
        "i",
      ),
      tag: new RegExp(
        typeof req.query.tag === "string" ? req.query.tag : "",
        "i",
      ),
    };

    const sorted = {
      sort: { date: -1 as 1 | -1 },
      select: "_id title slug date tag coverImageUrl summary createdAt",
    };

    const activities = await paginateResults(req, Activity, regex, sorted);
    res.status(200).send(activities);
  } catch (err) {
    console.log("Error getting all activities - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Get activity by slug
export async function getActivity(req: Request, res: Response): Promise<void> {
  const slug = req.params?.slug;
  const isEdit = req.query?.isEdit === "true"; // Check if isEdit query param is true
  if (!slug) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }

  try {
    const activity = await Activity.findOne({ slug }).select(
      isEdit
        ? "-gallery -coverImageId -coverImageUrl -createdAt -updatedAt -__v"
        : "-updatedAt -coverImageId -__v",
    );
    if (!activity) {
      res.status(404).send({ message: "Activity not found" });
      return;
    }

    // Find activities with the same tag, limit to 10 results, exclude certain fields if not editing
    let sameTags: {
      date: String;
      title: String;
      slug: String;
    }[] = [];
    if (!isEdit) {
      sameTags = await Activity.find({ tag: activity.tag })
        .limit(10)
        .select(
          [
            "-gallery",
            "-content",
            "-coverImageId",
            "-coverImageUrl",
            "-summary",
            "-tag",
            "-_id",
            "-createdAt",
            "-updatedAt",
            "-__v",
          ].join(" "),
        );
    }

    res.status(200).send({ activity, sameTags });
  } catch (err) {
    console.log("Error getting activity - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Get home page activities
export async function getHomeActivities(
  _: Request,
  res: Response,
): Promise<void> {
  try {
    // get the events
    const events = await Activity.find({
      $or: [{ tag: "Event" }, { tag: "Workshop" }],
    })
      .sort({ date: -1 })
      .limit(8)
      .select(
        "-gallery" +
          " -content" +
          " -coverImageId" +
          " -updatedAt" +
          " -createdAt" +
          " -__v",
      );

    // get the articles
    const articles = await Activity.find({ tag: "Article" })
      .sort({ date: -1 })
      .limit(3)
      .select(
        "-gallery" +
          " -content" +
          " -coverImageId" +
          " -updatedAt" +
          " -createdAt" +
          " -__v",
      );

    res.status(200).send({ events, articles });
  } catch (err) {
    console.log("Error getting home activities - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Create new activity
export async function createActivity(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { files, body } = req;
    if (!files || !body) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // Validate request body
    const { error: validationError } = activitySchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    body.title = body.title.trim();

    // generate the activity slug
    const slug = await generateSlug(body.title, Activity);
    body.slug = slug;

    // Upload cover image
    let activityImageFile;
    if (Array.isArray(files)) {
      res.status(400).send({ message: "Invalid files format" });
      return;
    } else if ("activityImage" in files && Array.isArray(files.activityImage)) {
      activityImageFile = files.activityImage[0];
    } else {
      res.status(400).send({ message: "Activity image not provided" });
      return;
    }
    const { url, imgId } = await uploadImage(activityImageFile, true);
    body.coverImageUrl = url;
    body.coverImageId = imgId;

    // Upload gallery images if provided
    if (files?.gallery) {
      body.gallery = await uploadMultipleImages(files.gallery);
    }

    // Create the activity
    await Activity.create(body);
    console.log("Activity added successfully -", "\n---\n");

    res.status(200).send({ message: "Activity added" });
  } catch (err) {
    console.log("Error creating activity - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Edit activity
export async function editActivity(req: Request, res: Response): Promise<void> {
  try {
    const { slug, ...updates } = req.body;
    if (!slug || typeof slug !== "string") {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // Validate slug
    const { error: validationResult } = activitySchema.validate(updates);
    if (validationResult) {
      res.status(400).send({ message: validationResult.details[0].message });
      return;
    }

    // Check if activity exists
    const previousActivity = await Activity.findOne({ slug });
    if (!previousActivity) {
      res.status(404).send({ message: "Activity not found" });
      return;
    }

    // If title is being updated, generate a new slug
    if (updates.title && updates.title !== previousActivity.title) {
      updates.title = updates.title.trim();
      updates.slug = await generateSlug(updates.title, Activity);
    }

    // Update images if new images are uploaded
    if (req?.files) {
      // Check if activity image is uploaded
      if (
        req.files &&
        typeof req.files === "object" &&
        !Array.isArray(req.files) &&
        "activityImage" in req.files &&
        Array.isArray(req.files.activityImage)
      ) {
        deleteFile(previousActivity.coverImageId);
        const { url, imgId } = await uploadImage(
          req.files.activityImage[0],
          true,
        );
        updates.coverImageUrl = url;
        updates.coverImageId = imgId;
      }

      // Check if gallery images are uploaded
      if (
        req.files &&
        typeof req.files === "object" &&
        !Array.isArray(req.files) &&
        "gallery" in req.files
      ) {
        previousActivity.gallery.forEach((image) => deleteFile(image.imgId));
        const gallery = await uploadMultipleImages(req.files.gallery);
        updates.gallery = gallery;
      }
    }

    // Update the activity
    await Activity.findOneAndUpdate({ slug }, updates, {
      new: true,
    });

    res.status(200).send({ message: "Activity updated" });
  } catch (err) {
    console.log("Error editing activity - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Delete activity
export async function deleteActivity(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const slug = req.body.slug;
    if (!slug || typeof slug !== "string") {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // Check if activity exists
    const activity = await Activity.findOneAndDelete({ slug });
    if (!activity) {
      res.status(404).send({ message: "Activity not found" });
      return;
    }

    // Delete activity images from imageKit
    deleteFile(activity.coverImageId);
    activity.gallery.forEach((image) => deleteFile(image.imgId));

    res.status(200).send({ message: "Activity deleted" });
  } catch (err) {
    console.log("Error deleting activity - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
