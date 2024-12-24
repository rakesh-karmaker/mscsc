const mongoose = require("mongoose");

const ExecutiveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    socialLinks: [{ type: String }],
    image: { type: String, required: true },
    panel: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Executive", ExecutiveSchema);
