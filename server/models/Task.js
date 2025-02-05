const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    summary: { type: String, required: true },
    instructions: { type: String, required: true },
    deadline: { type: Date, required: true },
    champion: { type: String, required: true },
    submission: {
      type: [
        {
          memberName: { type: String, required: true },
          memberEmail: { type: String, required: true },
          memberBatch: { type: String, required: true },
          memberImage: { type: String, required: true },
          answer: { type: String, required: true },
          poster: { type: String, optional: true },
          posterID: { type: String, optional: true },
          submissionDate: { type: Date, default: new Date() },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
