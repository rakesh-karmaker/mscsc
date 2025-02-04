const Activity = require("../models/Activity");
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

    if (req.query.limit === "all") {
      const activities = await Activity.find().sort({ ...sorted });
      res.status(200).send(activities);
    } else {
      const activities = await paginatedResults(
        req,
        res,
        Activity,
        regex,
        sorted
      );
      res.status(200).send(activities);
    }
  } catch (err) {
    console.log("Error fetching all activities - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const activity = await Activity.findById(req.params._id);
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }

    res.status(200).send(activity);
  } catch (err) {
    console.log("Error fetching activity - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Add Activity
exports.addActivity = async (req, res) => {
  try {
    const { files, body } = req;
    console.log(files, body);
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

    const { url, imgId } = await uploadImage(res, files.activityImage[0], true);
    body.coverImageUrl = url;
    body.coverImageId = imgId;

    if (files?.gallery) {
      body.gallery = await uploadMultipleImages(res, files.gallery);
    }
    const activity = await Activity.create(body);
    console.log(activity);
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
    const { _id, ...updates } = req.body;
    const { error: validationResult } = activitySchema.validate(updates);
    if (validationResult) {
      return res
        .status(400)
        .send({ message: validationResult.details[0].message });
    }

    if (req?.files) {
      const previousActivity = await Activity.findById(_id);
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

    const activity = await Activity.findByIdAndUpdate(_id, updates, {
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
    const id = req.body._id;
    const activity = await Activity.findByIdAndDelete(id);
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
