const Member = require("../models/Member");
const Task = require("../models/Task");
const generateSlug = require("../utils/generateSlug");
const { getDate } = require("../utils/getDate");
const { uploadImage, deleteImage } = require("../utils/imagekit");
const { taskSchema } = require("../utils/validation");

// create a new task
const createTask = async (req, res) => {
  try {
    // validate the request
    const { error: validationError } = taskSchema.validate(req.body);
    if (validationError) {
      return res.status(400).send({
        subject: validationError.details[0].context.key,
        message: validationError.details[0].message,
      });
    }

    //generate a slug
    const slug = await generateSlug(req.body.name, Task);
    req.body.slug = slug;

    // create a new task
    const newTask = new Task({ ...req.body });
    await newTask.save();

    console.log("New task created successfully -", getDate(), "\n---\n");
    res.status(200).send({ newTask });
  } catch (err) {
    console.log("Error creating a new task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// edit a task
const editTask = async (req, res) => {
  try {
    const { slug, ...updates } = req.body;

    // validate the request
    if (!slug) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const { error: validationError } = taskSchema.validate(updates);
    if (validationError) {
      return res.status(400).send({
        subject: validationError.details[0].context.key,
        message: validationError.details[0].message,
      });
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(slug, updates, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    console.log("Task edited successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error editing a task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// submit a task
const submitTask = async (req, res) => {
  try {
    const { slug, memberId, answer } = req.body;
    // const file = req.file;

    // check if the task exists
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // check if the submission exists
    const submission = task.submission.find((s) => s.memberId === memberId);
    if (submission) {
      return res.status(400).send({ message: "Submission already exists" });
    }

    // get the member data
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }
    const answers = {
      memberId,
      memberName: member.name,
      memberEmail: member.email,
      memberBatch: member.batch,
      memberImage: member.image,
      answer,
    };

    // validate the request
    if (!_id || !answer || !memberId) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // upload the poster
    // const { url, imgId } = await uploadImage(req, file, true);
    // answers.poster = url;
    // answers.posterId = imgId;

    // update the task
    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      { $push: { submission: answers } },
      { new: true }
    );

    console.log(
      member.name,
      "submitted a task successfully -",
      getDate(),
      "\n---\n"
    );
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error submitting a task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// edit a submission
const editSubmission = async (req, res) => {
  try {
    const { _id, submissionId, answer } = req.body;
    const file = undefined;

    // validate the request
    if (!_id || !submissionId || !answer) {
      return res.status(400).send({ message: "Invalid request" });
    }

    let updatedSubmission;
    if (file) {
      await deleteImage(res, req.body.imgId);
      // upload the poster
      const { url, imgId } = await uploadImage(req, file, true);

      // update the submission
      updatedSubmission = await Task.updateOne(
        { _id, "submission._id": submissionId },
        {
          $set: {
            "submission.$.answer": answer,
            "submission.$.poster": url,
            "submission.$.posterId": imgId,
          },
        },
        { new: true }
      );
    } else {
      // update the submission
      updatedSubmission = await Task.updateOne(
        { _id, "submission._id": submissionId },
        { $set: { "submission.$.answer": answer } },
        { new: true }
      );
    }

    if (!updatedSubmission.matchedCount) {
      return res.status(404).send({ message: "Submission not found" });
    }

    const updatedTask = await Task.findById(_id);
    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    console.log("Submission edited successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error editing a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// delete a submission
const deleteSubmission = async (req, res) => {
  try {
    const { _id, submissionId } = req.body;

    // validate the request
    if (!_id || !submissionId) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // delete the poster
    // await deleteImage(res, posterId);

    // update the submission
    const updatedSubmission = await Task.updateOne(
      { _id, "submission._id": submissionId },
      {
        $pull: { submission: { _id: submissionId } },
      }
    );
    console.log(updatedSubmission);

    if (!updatedSubmission.matchedCount) {
      return res.status(404).send({ message: "Submission not found" });
    }

    const updatedTask = await Task.findById(_id);
    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    console.log("Submission deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error deleting a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// make a champion
const makeChampion = async (req, res) => {
  try {
    const { _id, memberId, submissionId } = req.body;

    // validate the request
    if (!_id || !memberId || !submissionId) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // find match
    const match = await Task.findOne({ _id, "submission._id": submissionId });
    if (match.matchedCount === 0) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // update the submission
    const updatedSubmission = await Task.updateOne(
      { _id },
      { champion: submissionId },
      { new: true }
    );
  } catch (err) {
    console.log("Error deleting a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createTask,
  editTask,
  submitTask,
  editSubmission,
  deleteSubmission,
};
