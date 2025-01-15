const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const { paginatedResults } = require("../utils/paginatedResults");
const { uploadImage, deleteImage } = require("../utils/imagekit");
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

    const members = await paginatedResults(
      req,
      res,
      Member,
      regex,
      sorted,
      "-password"
    );
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
    const { _id: id, ...updates } = req.body;

    const previousUser = await Member.findById(id);
    if (!previousUser)
      return res.status(404).send({ message: "User not found" });

    if (previousUser._id.toString() !== req.user._id) {
      console.log("Mismatched id");
      const adminData = await Member.findById(req.user._id);
      if (!adminData || adminData?.role !== "admin")
        return res.status(401).send({ message: "Access Denied" });
    }

    // Edit User Timeline
    if (updates && updates.timeline) {
      console.log(updates.timeline);
      const timeline = JSON.parse(updates.timeline);
      const member = await Member.findOneAndUpdate(
        { _id: id },
        { timeline: timeline },
        { new: true }
      ).select("-password");
      if (!member) return res.status(404).send({ message: "Member not found" });
      console.log("user edited");
      return res.status(200).send({ message: "Edit successful", member });
    }

    // Edit User Credentials

    if (req?.file) {
      console.log(previousUser.imgId);
      deleteImage(res, previousUser.imgId);
      const { url, imgId } = await uploadImage(res, req.file);
      updates.image = url;
      updates.imgId = imgId;
    }

    if (updates?.password === "") {
      updates.password = previousUser.password;
    } else if (updates && updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }

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
