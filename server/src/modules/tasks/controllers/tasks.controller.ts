import { Request, Response } from "express";
import Task from "../task.model.js";
import { getTaskQuery } from "../task.queries.js";
import Member from "../../../shared/models/member.model.js";
import generateSlug from "../../../shared/utils/generate-slug.js";
import { taskSchema } from "../task.schema.js";
import { deleteFile } from "../../../shared/lib/file-uploader.js";
import logger from "../../../shared/config/winston.js";
import mongoose from "mongoose";

// get all tasks
export async function getAllTasks(req: Request, res: Response): Promise<void> {
  const params = req.query as {
    name?: string;
    category?: string;
    page?: string;
  };

  // Create regex for filtering
  const regex = {
    name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
    category: new RegExp(
      typeof params.category === "string" ? params.category : "",
      "i",
    ),
  };

  try {
    const tasks = await Task.aggregate([
      { $match: { name: regex.name, category: regex.category } },
      { $addFields: { submissionCount: { $size: "$submissions" } } },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          summary: 1,
          deadline: 1,
          category: 1,
          first: 1,
          second: 1,
          third: 1,
          submissionCount: 1,
        },
      },
    ]);

    const totalLength = tasks.length;
    const results = tasks.slice(
      parseInt(params.page || "1") * 10 - 10,
      parseInt(params.page || "1") * 10,
    );

    res.status(200).send({ results: results, totalLength: totalLength });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching tasks", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// get task by slug
export async function getTask(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const username = req.query.username as string | undefined;
  if (!slug || (username !== undefined && username.trim() === "")) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }
  try {
    const member = await Member.findOne({ slug: username }).select("_id");
    if (username && !member) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    /// get the task using aggregation pipeline to filter submissions
    const task = await getTaskQuery(
      slug as string,
      member?._id.toString() || "",
    );
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    // add all the submitters info
    // TODO: Optimize this to use aggregation pipeline to reduce the number of queries
    const submitters = task.submissions.map((s: any) => s.memberId);
    const members = await Member.find({ _id: { $in: submitters } })
      .select("name image slug branch batch isImageHidden isImageVerified")
      .lean();
    task.submissions.forEach(
      (s: {
        memberId: mongoose.Types.ObjectId;
        submissionDate: string;

        answer?: string;
        poster?: string | null;
        name?: string;
        slug?: string;
        image?: string;
        branch?: string;
        batch?: string;
        isImageHidden?: boolean;
        isImageVerified?: boolean;
      }) => {
        const member = members.find(
          (m) => m._id.toString() === s.memberId.toString(),
        );
        if (member) {
          s.name = member.name;
          s.slug = member.slug;
          s.image = member.image;
          s.branch = member.branch;
          s.batch = member.batch.toString();
          s.isImageHidden = member.isImageHidden ?? true; // default to true if undefined
          s.isImageVerified = member.isImageVerified ?? false; // default to false if undefined
        }
      },
    );

    res.status(200).send(task);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching task", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// create a new task
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    // validate the request
    const { error: validationError } = taskSchema.validate(req.body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    //generate a slug
    const slug = await generateSlug(req.body.name, Task);
    req.body.slug = slug;

    // covert the deadline in UTC
    req.body.deadline = new Date(req.body.deadline).toISOString();

    // create a new task
    const newTask = new Task({ ...req.body });
    await newTask.save();

    res.status(200).send({ message: "Task created successfully", slug });
    logger.info("Task created", {
      taskId: newTask._id,
      taskName: newTask.name,
      creator: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error creating task", {
      taskId: req.user?._id,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// edit a task
export async function editTask(req: Request, res: Response): Promise<void> {
  try {
    const { slug, ...updates } = req.body;

    // validate the request
    if (!slug) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }
    const { error: validationError } = taskSchema.validate(updates);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    // find the task
    const task = await Task.findOne({ slug });
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    if (updates.deadline) {
      // convert the deadline in UTC
      updates.deadline = new Date(updates.deadline).toISOString();
    }

    // generate a new slug if the name is changed
    if (task.name !== updates.name) {
      const newSlug = await generateSlug(updates.name, Task);
      updates.slug = newSlug;
    }

    // update the task
    task.set(updates);
    await task.save();

    res
      .status(200)
      .send({ message: "Task edited successfully", slug: task.slug });
    logger.info("Task edited", {
      taskId: task._id,
      taskName: task.name,
      editor: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error editing task", {
      taskId: req.user?._id,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      editor: req.user?._id,
    });
  }
}

// delete a task
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const slug = req.body.slug;
    if (!slug || typeof slug !== "string") {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // find the task and delete it
    const task = await Task.findOneAndDelete({ slug });
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    // delete all submissions images from the storage
    const submissions = task.submissions;
    for (let i = 0; i < submissions.length; i++) {
      if (
        typeof submissions[i].posterId === "string" &&
        submissions[i].posterId !== null
      ) {
        await deleteFile(submissions[i].posterId as string);
      }
    }

    // delete all submissions from the members' profile
    for (let i = 0; i < submissions.length; i++) {
      await Member.findOneAndUpdate(
        { _id: submissions[i].memberId },
        {
          $pull: { submissions: { taskId: task._id } }, // remove the task from the submissions array
        },
      );
    }

    // delete winners timeline entries
    if (task.first || task.second || task.third) {
      // delete the old winners' timeline
      while (task.first || task.second || task.third) {
        const winners = [task.first, task.second, task.third];
        for (let i = 0; i < winners.length; i++) {
          // check if the winner is null
          if (!winners[i]) {
            continue;
          }
          const winner = await Member.findOne({ _id: winners[i] });
          if (winner) {
            await Member.findOneAndUpdate(
              { _id: winners[i] },
              {
                $pull: {
                  timeline: {
                    taskId: task._id, // remove the task from the timeline array
                  },
                },
              },
            );
          }
        }
      }
    }

    res
      .status(200)
      .send({ message: "Task deleted successfully", method: "DELETE" });

    logger.info("Task deleted", {
      taskId: task._id,
      taskName: task.name,
      deletedBy: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error deleting task", {
      taskId: req.user?._id,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      deletedBy: req.user?._id,
    });
  }
}
