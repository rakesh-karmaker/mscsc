const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  memberName: { type: String },
  memberEmail: { type: String },
  memberBatch: { type: String },
  memberImage: { type: String },
  answer: { type: String },
  poster: { type: String },
  posterID: { type: String },
  submissionDate: { type: Date, default: new Date() },
});

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    summary: { type: String, required: true },
    instructions: { type: String, required: true },
    deadline: { type: Date, required: true },
    champion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task.submission",
      default: null,
    },
    taskType: {
      type: String,
      enum: ["article writing", "poster design"],
      required: true,
    },
    submission: {
      type: [SubmissionSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
