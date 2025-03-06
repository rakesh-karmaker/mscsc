const Member = require("../models/Member");
const Task = require("../models/Task");
const generateSlug = require("../utils/generateSlug");
const { getDate } = require("../utils/getDate");
const getPosition = require("../utils/getPosition");
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
    const select =
      "-__v" +
      " -createdAt" +
      " -updatedAt" +
      " -instructions" +
      " -imageRequired";
    const paginatedTasks = await paginatedResults(
      req,
      res,
      Task,
      regex,
      sorted,
      select
    );

    // reformat the tasks and remove the submissions data to reduce the response size
    const tasks = {
      ...paginatedTasks,
      results: paginatedTasks.results.map((task) => {
        if (!task) {
          return {};
        }
        const { submissions, ...result } = task._doc;
        return {
          ...result,
          submissionCount: submissions?.length || 0,
        };
      }),
    };

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
          category: 1,
          createdAt: 1,
          first: 1,
          second: 1,
          third: 1,
          imageRequired: 1,
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

    // covert the deadline in UTC
    req.body.deadline = new Date(req.body.deadline).toISOString();

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

    if (updates.deadline) {
      // convert the deadline in UTC
      updates.deadline = new Date(updates.deadline).toISOString();
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
      if (submissions[i].posterId) {
        await deleteImage(res, submissions[i].posterId);
      }
    }

    // delete all submissions from the members' profile
    for (let i = 0; i < submissions.length; i++) {
      await Member.findOneAndUpdate(
        { slug: submissions[i].username },
        {
          $pull: { submissions: { taskId: task._id } }, // remove the task from the submissions array
        }
      );
    }

    // delete winners
    if (task.first || task.second || task.third) {
      // delete the old winners' timeline
      while (task.first || task.second || task.third) {
        const winners = [task.first, task.second, task.third];
        for (let i = 0; i < winners.length; i++) {
          // check if the winner is null
          if (!winners[i]) {
            continue;
          }
          const winner = await Member.findOne({ slug: winners[i] });
          if (winner) {
            await Member.findOneAndUpdate(
              { slug: winners[i] },
              {
                $pull: {
                  timeline: {
                    taskId: task._id, // remove the task from the timeline array
                  },
                },
              }
            );
          }
        }
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

    // validate the request
    if (!slug || !answer || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    // check if the submission exists
    const task = await Task.findOne({ slug });
    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // check the deadline in UTC
    const { deadline } = task;
    const now = new Date().toISOString();
    if (now > deadline) {
      return res
        .status(400)
        .send({ message: "Submission deadline has passed" });
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
      submissionDate: new Date().toISOString(),
      answer,
    };

    // check if the image is required
    if (task.imageRequired) {
      const file = req.file;
      if (!file) {
        return res.status(400).send({ message: "Image is required" });
      }
    }

    // upload the image
    if (req.file) {
      const { url, imgId } = await uploadImage(req, req.file, true);
      answers.poster = url;
      answers.posterId = imgId;
    }

    // update the task
    await Task.findOneAndUpdate(
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
    const file = req?.file;

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

    // check the deadline in UTC
    const { deadline } = task;
    const now = new Date().toISOString();
    if (now > deadline) {
      return res
        .status(400)
        .send({ message: "Submission deadline has passed" });
    }

    let updatedSubmission;
    const updates = {
      "submissions.$.answer":
        answer === "undefined" ||
        answer === undefined ||
        answer === "" ||
        !answer
          ? submission.answer
          : answer,
      "submissions.$.submissionDate": new Date().toISOString(),
    };

    if (file) {
      // delete the previous image if it exists
      if (submission.posterId) {
        await deleteImage(res, submission.posterId);
      }
      // upload the poster
      const { url, imgId } = await uploadImage(req, file, true);
      console.log("Image uploaded successfully -", getDate(), "\n---\n");

      // add the poster
      updates["submissions.$.poster"] = url;
      updates["submissions.$.posterId"] = imgId;
    }

    // update the submission
    updatedSubmission = await Task.findOneAndUpdate(
      { slug, "submissions.username": username },
      { $set: updates },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).send({ message: "Submission not found" });
    }

    console.log("Submission edited successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Submission edited successfully" });
  } catch (err) {
    console.log("Error editing a submission - ", getDate(), "\n---\n", err);
    if (!res.headersSent) {
      res.status(500).send({ message: "Server error", error: err.message });
    }
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

    if (submission.posterId) {
      // delete the poster
      await deleteImage(res, submission.posterId);
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug, "submissions.username": username },
      {
        $pull: { submissions: { username } },
      }
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Submission not found" });
    }

    // delete submission from the member's profile
    const member = await Member.findOne({ slug: username });
    if (member) {
      await Member.findOneAndUpdate(
        { slug: username },
        { $pull: { submissions: { taskId: updatedTask._id } } },
        { new: true }
      );
    }

    // get the position
    const position = getPosition(updatedTask, username);

    // delete if a winner
    if (position !== null) {
      await Member.findOneAndUpdate(
        { slug: updatedTask[position] },
        {
          $pull: {
            timeline: {
              taskId: updatedTask._id,
            },
          },
        }
      );

      // update the task
      updatedTask[position] = null;
      await updatedTask.save();
    }

    console.log("Submission deleted successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Submission deleted successfully" });
  } catch (err) {
    console.log("Error deleting a submission - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// make a winner
const makeWinner = async (req, res) => {
  try {
    const { slug, username, position } = req.body;

    // validate the request
    if (!slug || !username || !position) {
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

    // check if the member is already the same positioned member
    if (match[position] === username) {
      return res
        .status(400)
        .send({ message: "Member has already won the same position" });
    }

    // check if another member is already has the position
    if (match[position] !== null) {
      return res
        .status(400)
        .send({ message: "Another member has already won the same position" });
    }

    // check if the member has any previous position if so then delete it
    const previousPosition = getPosition(match, username);
    if (previousPosition !== null) {
      // delete the old winner's timeline
      await Member.findOneAndUpdate(
        { slug: match[previousPosition] },
        {
          $pull: {
            timeline: {
              taskId: match._id,
            },
          },
        }
      );
      match[previousPosition] = null;
      await match.save();
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { $set: { [position]: username } },
      { new: true }
    );

    const title = (pos) => {
      switch (pos) {
        case "first":
          return "First Place";
        case "second":
          return "Second Place";
        case "third":
          return "Third Place";
        default:
          return "";
      }
    };

    // update the timeline
    const updatedTimeline = await Member.findOneAndUpdate(
      { slug: username },
      {
        $push: {
          timeline: {
            taskId: updatedTask._id,
            title: `${title(position)} at ${updatedTask.name}`,
            date: updatedTask.createdAt,
            tag: "Competition",
            description: updatedTask.summary,
            link: `/task/${updatedTask.slug}?user=${username}`,
          },
        },
      },
      { new: true }
    );

    if (!updatedTimeline) {
      return res.status(404).send({ message: "Member not found" });
    }

    console.log("Change position successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Changed position successfully" });
  } catch (err) {
    console.log("Error changing a position - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// delete a winner
const removeWinner = async (req, res) => {
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

    const position = getPosition(match, username);

    // check if the member is a winner
    if (position === null) {
      return res.status(400).send({ message: "Member is not a winner" });
    } else if (position !== null) {
      // delete the old winner's timeline
      await Member.findOneAndUpdate(
        { slug: match[position] },
        {
          $pull: {
            timeline: {
              taskId: match._id,
            },
          },
        }
      );
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { $set: { [position]: null } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }

    console.log("Removed a position successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Position changed successfully" });
  } catch (err) {
    console.log("Error changing a position - ", getDate(), "\n---\n", err);
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
  makeWinner,
  removeWinner,
};
