const Activity = require("../models/Activity");
const { uploadImage, deleteImage } = require("../utils/imagekit");
const { paginatedResults } = require("../utils/paginatedResults");
const { activitySchema } = require("../utils/validation");

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
    console.log("fetched all activities");
    res.status(200).send(activities);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Add Activity
exports.addActivity = async (req, res) => {
  try {
    const { file, body } = req;
    if (!file || !body) {
      return res.status(400).send({ message: "Invalid request" });
    }
    const { error: validationResult } = activitySchema.validate(body);
    if (validationResult) {
      console.log(validationResult);
      return res.status(400).send({
        subject: validationResult.details[0].context.key,
        message: validationResult.details[0].message,
      });
    }

    const { url, imgId } = await uploadImage(res, file);
    body.coverImageUrl = url;
    body.coverImageId = imgId;

    const activity = await Activity.create(body);
    console.log("Activity added successfully.");
    res.status(200).send({ message: "Activity added" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Edit Activity
exports.editActivity = async (req, res) => {
  try {
    console.log(req.body);
    const { _id, ...updates } = req.body;
    const { error: validationResult } = activitySchema.validate(updates);
    if (validationResult) {
      return res
        .status(400)
        .send({ message: validationResult.details[0].message });
    }

    if (req?.file) {
      const previousActivity = await Activity.findById(_id);
      if (!previousActivity) {
        return res.status(404).send({ message: "Activity not found" });
      }
      deleteImage(res, previousActivity.coverImageId);
      const { url, imgId } = await uploadImage(res, req.file);
      updates.coverImageUrl = url;
      updates.coverImageId = imgId;
    }

    const activity = await Activity.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }

    console.log("Activity updated successfully.");
    res.status(200).send({ message: "Activity updated" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Delete Activity
exports.deleteActivity = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body._id;
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }
    deleteImage(res, activity.coverImageId);
    console.log("Activity deleted successfully.");
    res.status(200).send({ message: "Activity deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
