const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
