import { Request, Response } from "express";
import paginateResults from "../lib/paginateResults.js";
import Task from "../models/Task.js";
import { getTaskQuery } from "../queries/taskQuery.js";
import Member from "../models/Member.js";
import generateSlug from "../utils/generateSlug.js";
import getDate from "../utils/getDate.js";
import { taskSchema } from "../lib/validation/taskSchema.js";
import { deleteImage } from "../lib/imageUploader.js";

// get all tasks
export async function getAllTasks(req: Request, res: Response): Promise<void> {
  try {
    // Create regex for filtering
    const regex = {
      name: new RegExp(
        typeof req.query.name === "string" ? req.query.name : "",
        "i"
      ),
      category: new RegExp(
        typeof req.query.category === "string" ? req.query.category : "",
        "i"
      ),
    };

    // Pagination and sorting options
    const sorted = {
      sort: { createdAt: -1 as 1 | -1 },
      select:
        "_id name slug summary deadline category submissions first second third", // Select only necessary fields
    };

    // Get paginated results
    const paginatedTasks = await paginateResults(req, Task, regex, sorted);

    // reformat the tasks and remove the submissions data to reduce the response size
    const tasks = {
      ...paginatedTasks,
      results: paginatedTasks.results.map((task) => {
        if (!task) {
          return {};
        }
        // If task has toObject, use it; otherwise, assume it's already a plain object
        const taskObj =
          typeof task.toObject === "function" ? task.toObject() : task;
        const { submissions, ...result } = taskObj;
        return {
          ...result,
          submissionCount: submissions?.length || 0,
        };
      }),
    };

    res.status(200).send(tasks);
  } catch (err) {
    console.log("Error fetching tasks - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// get task by slug
export async function getTask(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const username = req.query.username as string | undefined;
    if (!slug || (username !== undefined && username.trim() === "")) {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    /// get the task using aggregation pipeline to filter submissions
    const task = await getTaskQuery(slug, username || "");
    if (!task) {
      res.status(404).send({ message: "Task not found" });
      return;
    }

    // add all the submitters info
    // TODO: Optimize this to use aggregation pipeline to reduce the number of queries
    const submitters = task.submissions.map((s: any) => s.username);
    const members = await Member.find({ slug: { $in: submitters } });
    task.submissions.forEach((s: any) => {
      const member = members.find((m) => m.slug === s.username);
      if (member) {
        s.name = member.name;
        s.image = member.image;
        s.branch = member.branch;
        s.batch = member.batch;
        s.isImageHidden = member.isImageHidden ?? true; // default to true if undefined
      }
    });

    res.status(200).send(task);
  } catch (err) {
    console.log("Error fetching task - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
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

    console.log("New task created successfully -", getDate(), "\n---\n");
    res.status(200).send({ message: "Task created successfully", slug });
  } catch (err) {
    console.log("Error creating task - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
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
  } catch (err) {
    console.log("Error editing task - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
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
        await deleteImage(submissions[i].posterId as string);
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

    res
      .status(200)
      .send({ message: "Task deleted successfully", method: "DELETE" });
  } catch (err) {
    console.log("Error deleting task - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
