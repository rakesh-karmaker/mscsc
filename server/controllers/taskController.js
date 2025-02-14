const Member = require("../models/Member");
const Task = require("../models/Task");
const generateSlug = require("../utils/generateSlug");
const { getDate, getBdTime } = require("../utils/getDate");
const { uploadImage, deleteImage } = require("../utils/imagekit");
const { paginatedResults } = require("../utils/paginatedResults");
const { taskSchema } = require("../utils/validation");

// get all tasks
const getAllTasks = async (req, res) => {
  try {
    const regex = {
      name: new RegExp(req.query.name, "i"),
      category: new RegExp(req.query.category, "i"),
    };

    const sorted = { createdAt: -1 };
    const select = "-__v" + " -createdAt" + " -updatedAt" + " -instructions";
    const tasks = await paginatedResults(req, res, Task, regex, sorted, select);
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
    const username = req.query.username;

    // Find the task and filter the submissions
    const task = await Task.aggregate([
      { $match: { slug } },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          summary: 1,
          instructions: 1,
          deadline: 1,
          champion: 1,
          category: 1,
          createdAt: 1,
          submissions: {
            $map: {
              input: "$submissions",
              as: "sub",
              in: {
                username: "$$sub.username",
                name: "$$sub.name",
                email: "$$sub.email",
                branch: "$$sub.branch",
                batch: "$$sub.batch",
                image: "$$sub.image",
                poster: "$$sub.poster",
                submissionDate: "$$sub.submissionDate",
                answer: {
                  $cond: {
                    if: { $eq: ["$$sub.username", username] },
                    then: "$$sub.answer",
                    else: "$$REMOVE",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (!task || task.length === 0) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send(task[0]);
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
    res.status(200).send({ message: "Task created successfully", slug });
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
    await task.save();

    // get the new task
    const newTask = await Task.findById(task._id);

    console.log("Task edited successfully -", getDate(), "\n---\n");
    res
      .status(200)
      .send({ message: "Task edited successfully", slug: newTask.slug });
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
    const submissions = task.submissions;
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
    res
      .status(200)
      .send({ message: "Task deleted successfully", method: "DELETE" });
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
    const time = new Date(getBdTime());
    if (time > new Date(deadline).getTime()) {
      return res.status(400).send({ message: "Deadline passed" });
    }

    // check if the submission exists
    const submission = task.submissions.find((s) => s.username === username);
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
      name: member.name,
      email: member.email,
      branch: member.branch,
      batch: member.batch,
      image: member.image,
      submissionDate: getBdTime(),
      answer,
    };

    // upload the poster
    const { url, imgId } = await uploadImage(req, file, true);
    answers.poster = url;
    answers.posterId = imgId;

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { $push: { submissions: answers } },
      { new: true }
    );

    // add the submission into the member's profile
    await Member.findOneAndUpdate(
      { slug: username },
      { $push: { submissions: { taskId: task._id } } },
      { new: true }
    );

    console.log(
      member.name,
      "submitted a task successfully -",
      getDate(),
      "\n---\n"
    );
    res.status(200).send({ message: "Task submitted successfully" });
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

    // check if the submission exists
    const task = await Task.findOne({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    const submission = task.submissions.find((s) => s.username === username);
    if (!submission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // check the deadline
    const { deadline } = task;
    const time = new Date(getBdTime());
    if (time > new Date(deadline).getTime()) {
      return res.status(400).send({ message: "Deadline passed" });
    }

    let updatedSubmission;
    if (file) {
      await deleteImage(res, submission.posterId);
      // upload the poster
      const { url, imgId } = await uploadImage(req, file, true);
      console.log("Image uploaded successfully -", getDate(), "\n---\n");

      // update the submission
      updatedSubmission = await Task.findOneAndUpdate(
        { slug, "submissions.username": username },
        {
          $set: {
            "submissions.$.answer": answer,
            "submissions.$.poster": url,
            "submissions.$.posterId": imgId,
            "submissions.$.submissionDate": getBdTime(),
          },
        },
        { new: true }
      );
    } else {
      // update the submission
      updatedSubmission = await Task.findOneAndUpdate(
        { slug, "submissions.username": username },
        { $set: { "submissions.$.answer": answer } },
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
    res.status(200).send({ message: "Submission edited successfully" });
  } catch (err) {
    console.log("Error editing a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// delete a submission
const deleteSubmission = async (req, res) => {
  try {
    const { slug, username } = req.body;

    // validate the request
    if (!slug || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const previousSubmission = await Task.findOne({
      slug,
      "submissions.username": username,
    });
    if (!previousSubmission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    const submission = previousSubmission.submissions.find(
      (s) => s.username === username
    );

    // delete the poster
    await deleteImage(res, submission.posterId);

    // update the submission
    const updatedSubmission = await Task.findOneAndUpdate(
      { slug, "submissions.username": username },
      {
        $pull: { submissions: { username } },
      }
    );

    if (!updatedSubmission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // delete submission from the member's profile
    const member = await Member.findOne({ slug: username });
    if (member) {
      await Member.findOneAndUpdate(
        { slug: username },
        { $pull: { submissions: { taskId: updatedSubmission._id } } },
        { new: true }
      );
    }

    // delete if champion
    if (updatedSubmission.champion === username) {
      const champion = await Member.findOne({
        slug: updatedSubmission.champion,
      });
      if (champion) {
        await Member.findOneAndUpdate(
          { slug: updatedSubmission.champion },
          {
            $pull: {
              timeline: {
                taskId: updatedSubmission._id,
              },
            },
          }
        );
      }

      // update the task
      champion.champion = null;
      await champion.save();
    }

    console.log("Submission deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Submission deleted successfully" });
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
    const match = await Task.findOne({
      slug,
      "submissions.username": username,
    });
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
    res.status(200).send({ message: "Champion assigned successfully" });
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
    const match = await Task.findOne({
      slug,
      "submissions.username": username,
    });
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
    res.status(200).send({ message: "Champion deleted successfully" });
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
