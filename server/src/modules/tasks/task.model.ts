import mongoose from "mongoose";
import { TaskSchemaType } from "./task.types.js";

const SubmissionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  answer: { type: String },
  poster: { type: String, default: null },
  posterId: { type: String, default: null },
  submissionDate: { type: Date, default: new Date() },
});

const TaskSchema = new mongoose.Schema<TaskSchemaType>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    summary: { type: String, required: true },
    instructions: { type: String, required: true },
    deadline: { type: Date, required: true },
    first: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    second: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    third: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    imageRequired: { type: Boolean, default: false },
    category: {
      type: String,
      enum: ["article writing", "poster design"],
      required: true,
    },
    submissions: {
      type: [SubmissionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<TaskSchemaType>("Task", TaskSchema);
