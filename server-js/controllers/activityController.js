const Activity = require("../models/Activity");
const generateSlug = require("../utils/generateSlug");
const { getDate } = require("../utils/getDate");
const {
  uploadImage,
  deleteImage,
  uploadMultipleImages,
} = require("../utils/imagekit");
const { paginatedResults } = require("../utils/paginatedResults");
const { activitySchema } = require("../utils/validation");
const mongoose = require("mongoose");

// Get All Activities
exports.getAllActivities = async (req, res) => {
  try {
    const regex = {
      title: new RegExp(req.query.title, "i"),
      tag: new RegExp(req.query.tag, "i"),
    };
    const sorted = { date: -1 };

    const activities = await paginatedResults(
      req,
      res,
      Activity,
      regex,
      sorted
    );
    res.status(200).send(activities);
  } catch (err) {
    console.log("Error fetching all activities - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Activity.find({
      $or: [{ tag: "Event" }, { tag: "Workshop" }],
    })
      .sort({ date: -1 })
      .limit(8)
      .select("-gallery" + " -content" + " -coverImageId");
    res.status(200).send(events);
  } catch (err) {
    console.log("Error fetching all events - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Activity.find({ tag: "Article" })
      .sort({ date: -1 })
      .limit(3)
      .select("-gallery" + " -content" + " -coverImageId");
    res.status(200).send(articles);
  } catch (err) {
    console.log("Error fetching all articles - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const { slug } = req.params;
    const activity = await Activity.findOne({ slug });
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }

    const sameTags = await Activity.find({ tag: activity.tag })
      .limit(10)
      .select(
        "-gallery" +
          " -content" +
          " -coverImageId" +
          " -coverImageUrl" +
          " -summary" +
          " -tag" +
          " -_id" +
          " -createdAt" +
          " -updatedAt" +
          " -__v"
      );

    res.status(200).send({ activity, sameTags });
  } catch (err) {
    console.log("Error fetching activity - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Add Activity
exports.addActivity = async (req, res) => {
  try {
    const { files, body } = req;
    if (!files || !body) {
      return res.status(400).send({ message: "Invalid request" });
    }
    const { error: validationError } = activitySchema.validate(body);
    if (validationError) {
      return res.status(400).send({
        subject: validationError.details[0].context.key,
        message: validationError.details[0].message,
      });
    }

    body.title = body.title.trim();
    // generate the activity slug
    const slug = await generateSlug(body.title, Activity);
    body.slug = slug;

    const { url, imgId } = await uploadImage(res, files.activityImage[0], true);
    body.coverImageUrl = url;
    body.coverImageId = imgId;

    if (files?.gallery) {
      body.gallery = await uploadMultipleImages(res, files.gallery);
    }
    await Activity.create(body);
    console.log("Activity added successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Activity added" });
  } catch (err) {
    console.log("Error adding activity - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Edit Activity
exports.editActivity = async (req, res) => {
  try {
    const { slug, ...updates } = req.body;
    const { error: validationResult } = activitySchema.validate(updates);
    if (validationResult) {
      return res
        .status(400)
        .send({ message: validationResult.details[0].message });
    }

    if (req?.files) {
      const previousActivity = await Activity.findOne({ slug });
      if (!previousActivity) {
        return res.status(404).send({ message: "Activity not found" });
      }

      if (req?.files?.activityImage) {
        deleteImage(res, previousActivity.coverImageId);
        const { url, imgId } = await uploadImage(
          res,
          req.files.activityImage[0],
          true
        );
        updates.coverImageUrl = url;
        updates.coverImageId = imgId;
      }

      if (req?.files?.gallery) {
        previousActivity.gallery.forEach((image) =>
          deleteImage(res, image.imgId)
        );
        const gallery = await uploadMultipleImages(res, req.files.gallery);
        updates.gallery = gallery;
      }
    }

    const activity = await Activity.findOneAndUpdate({ slug }, updates, {
      new: true,
    });
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }
    console.log("Activity updated successfully -", getDate());
    res.status(200).send({ message: "Activity updated" });
  } catch (err) {
    console.log("Error editing activity - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Delete Activity
exports.deleteActivity = async (req, res) => {
  try {
    const slug = req.body.slug;
    const activity = await Activity.findOneAndDelete({ slug });
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }
    deleteImage(res, activity.coverImageId);
    activity.gallery.forEach((image) => deleteImage(res, image.imgId));

    console.log("Activity deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Activity deleted" });
  } catch (err) {
    console.log("Error deleting activity - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
