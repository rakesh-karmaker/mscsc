const mongoose = require("mongoose");

const OPTSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  opt: { type: String, required: true },
  token: { type: String, default: null },
  createdAt: { type: Date },
  expiresAt: { type: Date },
});

module.exports = mongoose.model("ResetOtp", OPTSchema);
