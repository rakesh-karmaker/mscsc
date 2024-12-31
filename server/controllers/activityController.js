const Activity = require("../models/Activity");
const imagekit = require("../utils/imagekit");
const { paginatedResults } = require("../utils/paginatedResults");
const { activitySchema } = require("../utils/validation");

// Get All Activities
exports.getAllActivities = async (req, res) => {
  try {
    const regex = {
      //Todo: change activityTitle to title when resetting the BD
      activityTitle: new RegExp(req.query.search, "i"),
      tag: new RegExp(req.query.topic, "i"),
    };
    const length = await Activity.find({ ...regex }).countDocuments();
    const activities = await paginatedResults(req, Activity, regex, length);
    console.log(activities);
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
    console.log("body", body, "\nfile", file);
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

    const uploadPromise = imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
    });

    const imgRes = await uploadPromise;
    console.log(imgRes);
    req.body.coverImageUrl = imgRes.url;
    req.body.coverImageId = imgRes.fileId;

    const activity = await Activity.create(req.body);
    console.log(activity);
    res.status(200).send({ message: "Activity added" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};

// Edit Activity
exports.editActivity = async (req, res) => {
  try {
    const id = req.body._id;
    const { error: validationResult } = activitySchema.validate(req.body);
    if (validationResult) {
      return res
        .status(400)
        .send({ message: validationResult.details[0].message });
    }
    if (req.file) {
      const previousActivity = await Activity.findById(id);
      if (!previousActivity) {
        return res.status(404).send({ message: "Activity not found" });
      }

      imagekit.deleteFile(previousActivity.coverImageId, (error, result) => {
        if (error) {
          return res.status(500).send({ error: "Failed to delete image." });
        }
      });
      const uploadPromise = imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
      });

      const imgRes = await uploadPromise;
      console.log(imgRes);
      req.body.coverImageUrl = imgRes.url;
      req.body.coverImageId = imgRes.fileId;
    }
    const activity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }
    res.status(200).send({ message: "Activity updated" });
  } catch (err) {
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
    imagekit.deleteFile(activity.coverImageId, (error, result) => {
      if (error) {
        return res.status(500).send({ error: "Failed to delete image." });
      }
      res.status(200).send({ message: "Activity deleted" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
