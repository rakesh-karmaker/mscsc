const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    date: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    coverImageUrl: { type: String, required: true },
    coverImageId: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    gallery: {
      type: [
        {
          url: { type: String, required: true },
          imgId: { type: String, required: true },
        },
      ],
      default: [],
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
