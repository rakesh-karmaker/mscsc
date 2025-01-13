const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const { paginatedResults } = require("../utils/paginatedResults");
const { deleteImage } = require("../utils/imagekit");
const { default: mongoose } = require("mongoose");

// Get All Members
const getAllMembers = async (req, res) => {
  try {
    const regex = {
      name: new RegExp(req.query.name, "i"),
      role: new RegExp(req.query.role, "i"),
      branch: new RegExp(req.query.branch, "i"),
    };
    const sorted = { _id: -1 };

    const members = await paginatedResults(req, res, Member, regex, sorted);
    members.adminLength = await Member.countDocuments({ role: "admin" });
    res.status(200).send(members);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Get User
const verifyUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await Member.findById(_id).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });

    user._id = user._id.toString();

    res.send({
      user,
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const getMemberById = async (req, res) => {
  const _id = req.params?._id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    console.log(_id);
    const member = await Member.findById(_id.toString()).select("-password");
    console.log(member, "member\n");
    if (!member) {
      console.log("Member not found");
      return res.status(404).send({ message: "Member not found" });
    }

    member._id = member._id.toString();
    console.log("member fetched");
    res.send(member);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err?.message });
  }
};

const editMember = async (req, res) => {
  try {
    const id = req.body?._id || req.user._id;
    console.log(id);

    // Edit User Timeline
    if (req.body && req.body.timeline) {
      console.log(req.body.timeline);
      const timeline = JSON.parse(req.body.timeline);
      const member = await Member.findOneAndUpdate(
        { _id: id },
        { timeline },
        { new: true }
      ).select("-password");
      if (!member) return res.status(404).send({ message: "Member not found" });
      console.log("user edited");
      return res.status(200).send({ message: "Edit successful", member });
    }

    // Edit User Credentials
    const previousUser = await Member.findById(id);
    if (!previousUser)
      return res.status(404).send({ message: "User not found" });

    if (req.body?.password && req.body.password === "") {
      req.body.password = previousUser.password;
    } else if (req.body && req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const { memberId, ...updates } = req.body;
    const user = await Member.findOneAndUpdate({ _id: id }, updates, {
      new: true,
    }).select("-password");

    console.log("user edited");
    if (user) return res.status(200).send({ message: "Edit successful", user });
    else return res.status(404).send({ message: "Edit failed" });
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res
        .status(409)
        .send({ message: "Email has already been taken", subject: "email" });
    }
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const deleteMember = async (req, res) => {
  console.log("delete member");
  try {
    console.log(req.body);
    const id = req.body?._id;
    if (!id) return res.status(400).send({ message: "Invalid request" });

    const member = await Member.findByIdAndDelete(id);
    if (!member) return res.status(404).send({ message: "Member not found" });
    console.log("Member deleted successfully.");

    deleteImage(res, member.imgId);
    res.status(200).send({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = {
  verifyUser,
  getMemberById,
  editMember,
  getAllMembers,
  deleteMember,
};
