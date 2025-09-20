const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    new: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
