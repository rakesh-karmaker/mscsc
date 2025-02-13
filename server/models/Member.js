const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SubmissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
});

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    batch: { type: String, required: true },
    branch: { type: String, required: true },
    image: { type: String, required: true },
    imgId: { type: String, required: true },
    reason: { type: String, required: true },
    socialLink: { type: String, required: true },
    timeline: {
      type: [
        {
          taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
          },
          tag: { type: String },
          date: { type: String },
          title: { type: String },
          description: { type: String },
          link: { type: String, default: "#" },
        },
      ],
    },
    submissions: [SubmissionSchema],
    reference: { type: String, required: true },
    role: { type: String, default: "member" },
    position: { type: String, default: "member" },
    new: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MemberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Member", MemberSchema);
