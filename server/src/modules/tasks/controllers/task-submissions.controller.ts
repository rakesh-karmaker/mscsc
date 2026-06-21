import { Request, Response } from "express";
import Task from "../task.model.js";
import Member from "../../../shared/models/member.model.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { Submission } from "../task.types.js";
import getPosition from "../utils/get-position.js";
import logger from "../../../shared/config/winston.js";
import { requireMinimumRole, ROLES } from "../../../shared/utils/roles.js";

// submit a task
export async function submitTask(req: Request, res: Response): Promise<void> {
  const { slug, username, answer } = req.body;

  // validate the request
  if (!slug || !answer || !username) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }

  try {
    // check if the submission exists
    const task = await Task.findOne({ slug }).select(
      "submissions deadline name _id",
    );
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

    const member = await Member.findOne({ slug: username }).select(
      "_id submissions",
    );
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    // check if the submission exists
    const previousSubmission = task.submissions.find(
      (s) => s.memberId.toString() === member._id.toString(),
    );
    if (previousSubmission) {
      res.status(400).send({ message: "Submission already exists" });
      return;
    }

    const submission: Submission = {
      memberId: member._id,
      submissionDate: new Date().toISOString(),
      poster: null,
      posterId: null,
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
      const { url, imgId } = await uploadImage(
        req.file,
        false, // don't crop the image
        `tasks`,
      );
      submission.poster = url;
      submission.posterId = imgId;
    }

    // update the task
    task.submissions.push(submission);
    await task.save();

    // add the submission into the member's profile
    member.submissions.push({ taskId: task._id });
    await member.save();

    res.status(200).send({ message: "Task submitted successfully" });
    logger.info("Task submitted", {
      taskId: task._id,
      taskName: task.name,
      submitterId: member._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error submitting task", {
      taskId: req.body.slug,
      submitterId: req.body.username,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// edit a submission
export async function editSubmission(
  req: Request,
  res: Response,
): Promise<void> {
  const { slug, username, answer } = req.body;
  const file = req?.file;

  // validate the request
  if (!slug || !username) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }
  try {
    // check if the submission exists
    const task = await Task.findOne({ slug }).select(
      "submissions deadline name _id",
    );
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

    const member = await Member.findOne({ slug: username }).select(
      "_id submissions",
    );
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    const previousSubmission: Submission | undefined = task.submissions.find(
      (s) => s.memberId.toString() === member._id.toString(),
    );
    if (!previousSubmission) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // update the submission
    if (
      answer !== "undefined" &&
      answer !== undefined &&
      answer !== "" &&
      answer
    ) {
      previousSubmission.answer = answer;
    }

    // if file exists, upload the image and delete the previous one
    if (file) {
      // delete the previous image if it exists
      if (previousSubmission.posterId) {
        deleteFile(previousSubmission.posterId);
      }
      // upload the poster
      const { url, imgId } = await uploadImage(file, false, `tasks`);

      // add the poster
      previousSubmission.poster = url;
      previousSubmission.posterId = imgId;
    }

    // update the submission
    task.submissions = task.submissions.map((s) => {
      if (s.memberId.toString() === member._id.toString()) {
        return previousSubmission;
      }
      return s;
    });

    await task.save();

    res.status(200).send({ message: "Submission edited successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error editing submission", {
      taskId: req.body.slug,
      submitterId: req.body.username,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// delete a submission
export async function deleteSubmission(
  req: Request,
  res: Response,
): Promise<void> {
  const { slug, username } = req.body;

  // validate the request
  if (!slug || !username) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }
  try {
    const member = await Member.findOne({ slug: username }).select(
      "_id submissions timeline",
    );
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    const isOwner = req.user?._id.toString() === member._id.toString();
    if (!isOwner && !requireMinimumRole(req.user?.role, ROLES.OBSERVER)) {
      res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permissions" });
      return;
    }

    // check if the submission exists
    const task = await Task.findOne({
      slug,
      "submissions.memberId": member._id.toString(),
    }).select("submissions first second third _id");
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // find the previous submission
    const previousSubmission = task.submissions.find(
      (s) => s.memberId.toString() === member._id.toString(),
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
    task.submissions = task.submissions.filter(
      (s) => s.memberId.toString() !== member._id.toString(),
    );

    // delete submission from the member's profile
    member.submissions = member.submissions.filter(
      (s) => s.taskId.toString() !== task._id.toString(),
    );

    // get the position
    const position = getPosition(task, member._id.toString());

    // delete if a winner
    if (position !== null) {
      member.timeline = member.timeline.filter(
        (t) => t.taskId?.toString() !== task._id.toString(),
      );

      // update the task
      task[position] = null;
    }

    await member.save();
    await task.save();

    res.status(200).send({ message: "Submission deleted successfully" });
    logger.info("Task submission deleted", {
      taskId: task._id,
      taskName: task.name,
      submitterName: member?.name,
      deletedBy: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error deleting submission", {
      taskId: req.body.slug,
      submitterId: req.body.username,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      deletedBy: req.user?._id,
    });
  }
}

// make a submission a winner
export async function makeWinner(req: Request, res: Response): Promise<void> {
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
  try {
    const member = await Member.findOne({ slug: username }).select(
      "_id submissions timeline",
    );
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    // find the task and submission
    const task = await Task.findOne({
      slug,
      "submissions.memberId": member._id.toString(),
    }).select("submissions first second third name summary createdAt slug _id");
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    // check if the member already has the same positioned member
    if (
      task[position as keyof typeof task]?.toString() === member._id.toString()
    ) {
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
    const previousPosition = getPosition(task, member._id.toString());
    if (previousPosition !== null) {
      // delete the old winner's timeline
      member.timeline = member.timeline.filter(
        (t) => t.taskId?.toString() !== task._id.toString(),
      );
      task[previousPosition] = null;
    }

    // update the task
    task[position as "first" | "second" | "third"] = member._id;

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
    member.timeline.push({
      taskId: task._id,
      title: `${title(position)} at ${task.name}`,
      date: task.createdAt,
      tag: "Competition",
      description: task.summary,
      link: `/task/${task.slug}?user=${username}`,
    });

    await member.save();
    await task.save();

    res.status(200).send({ message: "Changed position successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error making winner", {
      taskId: req.body.slug,
      submitterId: req.body.username,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// remove a winner from a position
export async function removeWinner(req: Request, res: Response): Promise<void> {
  const { slug, username } = req.body;

  // validate the request
  if (!slug || !username) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }
  try {
    const member = await Member.findOne({ slug: username }).select(
      "_id timeline",
    );
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    // find task
    const task = await Task.findOne({
      slug,
      "submissions.memberId": member._id.toString(),
    }).select("submissions first second third _id");
    if (!task) {
      res.status(404).send({ message: "Submission not found" });
      return;
    }

    const position = getPosition(task, member._id.toString());

    // check if the member is a winner
    if (position === null) {
      res.status(400).send({ message: "Member is not a winner" });
      return;
    } else if (position !== null) {
      // delete the old winner's timeline
      member.timeline = member.timeline.filter(
        (t) => t.taskId?.toString() !== task._id.toString(),
      );
    }

    // update the task
    task[position as "first" | "second" | "third"] = null;

    await member.save();
    await task.save();

    res.status(200).send({ message: "Position changed successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error removing winner", {
      taskId: req.body.slug,
      submitterId: req.body.username,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}
