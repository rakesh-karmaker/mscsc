import { Request, Response } from "express";
import Task from "../models/Task.js";
import Member from "../models/Member.js";
import { deleteFile, uploadImage } from "../lib/image-uploader.js";
import { SubmissionType, SubmissionUpdateType } from "../types/task-types.js";
import getPosition from "../utils/get-position.js";

// submit a task
export async function submitTask(req: Request, res: Response): Promise<void> {
  try {
    const { slug, username, answer } = req.body;

    // validate the request
    if (!slug || !answer || !username) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // check if the submission exists
    const task = await Task.findOne({ slug });
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    // check the deadline in UTC
    const { deadline } = task;
    const now = new Date().toISOString();
    if (now > new Date(deadline).toISOString()) {
      res.status(400).send({ message: "Submission deadline has passed" });
      return;
    }

    // check if the submission exists
    const previousSubmission = task.submissions.find(
      (s) => s.username === username,
    );
    if (previousSubmission) {
      res.status(400).send({ message: "Submission already exists" });
      return;
    }

    // get the member data
    const member = await Member.findOne({ slug: username });
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }
    const submission: SubmissionType = {
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
        res.status(400).send({ message: "Image is required" });
        return;
      }
    }

    // upload the image if exists
    if (req.file) {
      const { url, imgId } = await uploadImage(req.file, true, `tasks/${slug}`);
      submission.poster = url;
      submission.posterId = imgId;
    }

    // update the task
    await Task.findOneAndUpdate(
      { slug },
      { $push: { submissions: submission } },
      { new: true },
    );

    // add the submission into the member's profile
    await Member.findOneAndUpdate(
      { slug: username },
      { $push: { submissions: { taskId: task._id } } },
      { new: true },
    );

    res.status(200).send({ message: "Task submitted successfully" });
  } catch (err) {
    console.log("Error submitting task - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// edit a submission
export async function editSubmission(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { slug, username, answer } = req.body;
    const file = req?.file;

    // validate the request
    if (!slug || !username || !answer) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // check if the submission exists
    const task = await Task.findOne({ slug });
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }
    const previousSubmission = task.submissions.find(
      (s) => s.username === username,
    );
    if (!previousSubmission) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // check the deadline in UTC
    const { deadline } = task;
    const now = new Date().toISOString();
    if (now > new Date(deadline).toISOString()) {
      res.status(400).send({ message: "Submission deadline has passed" });
      return;
    }

    // update the submission
    const updates: SubmissionUpdateType = {
      "submissions.$.answer":
        answer === "undefined" ||
        answer === undefined ||
        answer === "" ||
        !answer
          ? previousSubmission.answer
          : answer,
      "submissions.$.submissionDate": new Date().toISOString(),
    };

    // if file exists, upload the image and delete the previous one
    if (file) {
      // delete the previous image if it exists
      if (previousSubmission.posterId) {
        deleteFile(previousSubmission.posterId);
      }
      // upload the poster
      const { url, imgId } = await uploadImage(file, true, `tasks/${slug}`);

      // add the poster
      updates["submissions.$.poster"] = url;
      updates["submissions.$.posterId"] = imgId;
    }

    // update the submission
    await Task.findOneAndUpdate(
      { slug, "submissions.username": username },
      { $set: updates },
      { new: true },
    );

    res.status(200).send({ message: "Submission edited successfully" });
  } catch (err) {
    console.log("Error editing submission - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// delete a submission
export async function deleteSubmission(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { slug, username } = req.body;

    // validate the request
    if (!slug || !username) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // check if the submission exists
    const task = await Task.findOne({
      slug,
      "submissions.username": username,
    });
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // find the previous submission
    const previousSubmission = task.submissions.find(
      (s) => s.username === username,
    );
    if (!previousSubmission) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // delete the poster if exists
    if (previousSubmission.posterId) {
      deleteFile(previousSubmission.posterId);
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug, "submissions.username": username },
      {
        $pull: { submissions: { username } },
      },
    );

    if (!updatedTask) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // delete submission from the member's profile
    const member = await Member.findOne({ slug: username });
    if (member) {
      await Member.findOneAndUpdate(
        { slug: username },
        { $pull: { submissions: { taskId: updatedTask._id } } },
        { new: true },
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
        },
      );

      // update the task
      updatedTask[position] = undefined;
      await updatedTask.save();
    }

    res.status(200).send({ message: "Submission deleted successfully" });
  } catch (err) {
    console.log("Error deleting submission - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// make a submission a winner
export async function makeWinner(req: Request, res: Response): Promise<void> {
  try {
    const { slug, username, position } = req.body;

    // validate the request
    if (
      !slug ||
      !username ||
      !position ||
      !["first", "second", "third"].includes(position)
    ) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // find the task and submission
    const task = await Task.findOne({
      slug,
      "submissions.username": username,
    });
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // check if the member already has the same positioned member
    if (task[position as keyof typeof task] === username) {
      res
        .status(400)
        .send({ message: "Member has already won the same position" });
      return;
    }

    // check if another member already has the position
    if (task[position as keyof typeof task] !== null) {
      res
        .status(400)
        .send({ message: "Another member has already won the same position" });
      return;
    }

    // check if the member has any previous position if so then delete it
    const previousPosition = getPosition(task, username);
    if (previousPosition !== null) {
      // delete the old winner's timeline
      await Member.findOneAndUpdate(
        { slug: task[previousPosition] },
        {
          $pull: {
            timeline: {
              taskId: task._id,
            },
          },
        },
      );
      task[previousPosition] = undefined;
      await task.save();
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { $set: { [position]: username } },
      { new: true },
    );
    if (!updatedTask) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    const title = (position: string) => {
      switch (position) {
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
      { new: true },
    );

    if (!updatedTimeline) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    res.status(200).send({ message: "Changed position successfully" });
  } catch (err) {
    console.log("Error making winner - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// remove a winner from a position
export async function removeWinner(req: Request, res: Response): Promise<void> {
  try {
    const { slug, username } = req.body;

    // validate the request
    if (!slug || !username) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // find task
    const task = await Task.findOne({
      slug,
      "submissions.username": username,
    });
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    const position = getPosition(task, username);

    // check if the member is a winner
    if (position === null) {
      res.status(400).send({ message: "Member is not a winner" });
      return;
    } else if (position !== null) {
      // delete the old winner's timeline
      await Member.findOneAndUpdate(
        { slug: task[position] },
        {
          $pull: {
            timeline: {
              taskId: task._id,
            },
          },
        },
      );
    }

    // update the task
    const updatedTask = await Task.findOneAndUpdate(
      { slug },
      { $set: { [position]: null } },
      { new: true },
    );

    if (!updatedTask) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    res.status(200).send({ message: "Position changed successfully" });
  } catch (err) {
    console.log("Error removing winner - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
