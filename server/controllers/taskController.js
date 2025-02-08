const Member = require("../models/Member");
const Task = require("../models/Task");
const generateSlug = require("../utils/generateSlug");
const { getDate } = require("../utils/getDate");
const { uploadImage, deleteImage } = require("../utils/imagekit");
const { paginatedResults } = require("../utils/paginatedResults");
const { taskSchema } = require("../utils/validation");

// get all tasks
const getAllTasks = async (req, res) => {
  try {
    const regex = {
      name: new RegExp(req.query.name, "i"),
      taskType: new RegExp(req.query.taskType, "i"),
    };

    const sorted = { createdAt: -1 };
    const tasks = await paginatedResults(req, res, Task, regex, sorted);
    res.status(200).send(tasks);
  } catch (err) {
    console.log("Error fetching all tasks - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// get a task
const getTask = async (req, res) => {
  try {
    const slug = req.params.slug;
    const task = await Task.findOne({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send(task);
  } catch (err) {
    console.log("Error fetching a task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

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

    const task = await Task.findOne({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (task.name !== updates.name) {
      // new slug
      const newSlug = await generateSlug(updates.name, Task);
      updates.slug = newSlug;
    }

    // update the task
    task.set(updates);
    const updatedTask = await task.save();

    console.log("Task edited successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error editing a task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// delete a task
const deleteTask = async (req, res) => {
  try {
    const slug = req.body.slug;
    const task = await Task.findOneAndDelete({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // delete all submissions
    const submissions = task.submission;
    for (let i = 0; i < submissions.length; i++) {
      await deleteImage(res, submissions[i].posterId);
    }

    // delete champion
    if (task.champion) {
      const champion = await Member.findOne({ slug: task.champion });
      if (champion) {
        await Member.findOneAndUpdate(
          { slug: task.champion },
          {
            $pull: {
              timeline: {
                taskId: task._id,
              },
            },
          }
        );
      }
    }

    console.log("Task deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ task });
  } catch (err) {
    console.log("Error deleting a task - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// submit a task
const submitTask = async (req, res) => {
  try {
    const { slug, username, answer } = req.body;
    const file = req.file;

    // validate the request
    if (!slug || !answer || !username || !file) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // check if the submission exists
    const task = await Task.findOne({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // check the deadline
    const { deadline } = task;
    if (Date.now() > deadline) {
      return res.status(400).send({ message: "Deadline passed" });
    }

    // check if the submission exists
    const submission = task.submission.find((s) => s.username === username);
    if (submission) {
      return res.status(400).send({ message: "Submission already exists" });
    }

    // get the member data
    const member = await Member.findOne({ slug: username });
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }
    const answers = {
      username,
      memberName: member.name,
      memberEmail: member.email,
      memberBatch: member.batch,
      memberImage: member.image,
      answer,
    };

    // upload the poster
    const { url, imgId } = await uploadImage(req, file, true);
    answers.poster = url;
    answers.posterId = imgId;

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
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
    const { slug, username, answer } = req.body;
    const file = req.file;

    // validate the request
    if (!slug || !username || !answer) {
      return res.status(400).send({ message: "Invalid request" });
    }

    let updatedSubmission;
    if (file) {
      await deleteImage(res, req.body.imgId);
      // upload the poster
      const { url, imgId } = await uploadImage(req, file, true);

      // update the submission
      updatedSubmission = await Task.findOneAndUpdate(
        { slug, "submission.username": username },
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
      updatedSubmission = await Task.findOneAndUpdate(
        { slug, "submission.username": username },
        { $set: { "submission.$.answer": answer } },
        { new: true }
      );
    }

    if (!updatedSubmission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    const updatedTask = await Task.findOne({ slug });
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
    const { slug, username, posterId } = req.body;

    // validate the request
    if (!slug || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // delete the poster
    await deleteImage(res, posterId);

    // update the submission
    const updatedSubmission = await Task.findOneAndUpdate(
      { slug, "submission.username": username },
      {
        $pull: { submission: { username } },
      }
    );

    if (!updatedSubmission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    console.log("Submission deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedSubmission });
  } catch (err) {
    console.log("Error deleting a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// make a champion
const makeChampion = async (req, res) => {
  try {
    const { slug, username } = req.body;

    // validate the request
    if (!slug || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // find match
    const match = await Task.findOne({ slug, "submission.username": username });
    if (!match) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // check if the member is already a champion
    if (match.champion === username) {
      return res.status(400).send({ message: "Member is already a champion" });
    } else if (match.champion) {
      // delete the old champion's timeline
      const oldChampion = await Member.findOne({ slug: match.champion });
      if (oldChampion) {
        await Member.findOneAndUpdate(
          { slug: match.champion },
          {
            $pull: {
              timeline: {
                taskId: match._id,
              },
            },
          }
        );
      }
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { champion: username },
      { new: true }
    );

    // update the timeline
    const updatedTimeline = await Member.findOneAndUpdate(
      { slug: username },
      {
        $push: {
          timeline: {
            taskId: updatedTask._id,
            title: `Champion at ${updatedTask.name}`,
            date: "2025-01-19",
            tag: "Competition",
            description: updatedTask.summary,
            link: "#",
          },
        },
      },
      { new: true }
    );

    if (!updatedTimeline) {
      return res.status(404).send({ message: "Member not found" });
    }

    console.log("Make a new champion successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error deleting a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// delete a champion
const deleteChampion = async (req, res) => {
  try {
    const { slug, username } = req.body;

    // validate the request
    if (!slug || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // find match
    const match = await Task.findOne({ slug, "submission.username": username });
    if (!match) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // check if the member is already a champion
    if (match.champion !== username) {
      return res.status(400).send({ message: "Member is not a champion" });
    } else if (match.champion) {
      // delete the old champion's timeline
      const oldChampion = await Member.findOne({ slug: match.champion });
      if (oldChampion) {
        await Member.findOneAndUpdate(
          { slug: match.champion },
          {
            $pull: {
              timeline: {
                taskId: match._id,
              },
            },
          }
        );
      }
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { champion: "" },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    console.log("Champion deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ updatedTask });
  } catch (err) {
    console.log("Error deleting a champion - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  editTask,
  deleteTask,
  submitTask,
  editSubmission,
  deleteSubmission,
  makeChampion,
  deleteChampion,
};
