const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    date: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    coverImageId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: "#" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
