const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
const { paginatedResults } = require("../utils/paginatedResults");
const { uploadImage, deleteImage } = require("../utils/imagekit");
const { getDate } = require("../utils/getDate");

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
    console.log("Error fetching all members - ", getDate(), "\n---\n", err);
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
    console.log("Error verifying user - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const getMember = async (req, res) => {
  const slug = req.params?.slug;
  if (!slug) {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    const member = await Member.findOne({ slug }).select("-password");
    if (!member) {
      return res.status(404).send({ message: "Member not found" });
    }

    member._id = member._id.toString();
    res.send(member);
  } catch (err) {
    console.log("Error fetching member - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err?.message });
  }
};

const editMember = async (req, res) => {
  try {
    const { slug, ...updates } = req.body;

    const previousUser = await Member.findOne({ slug });
    if (!previousUser)
      return res.status(404).send({ message: "User not found" });

    if (previousUser._id.toString() !== req.user._id) {
      const adminData = await Member.findById(req.user._id);
      console.log(`Mismatched id - ${adminData?.name} - ${req.user._id}`);
      if (!adminData || adminData?.role !== "admin")
        return res.status(401).send({ message: "Access Denied" });
    }

    // Edit User Timeline
    if (updates && updates.timeline) {
      const timeline = JSON.parse(updates.timeline);
      const member = await Member.findOneAndUpdate(
        { slug },
        { timeline: timeline },
        { new: true }
      ).select("-password");
      if (!member) return res.status(404).send({ message: "Member not found" });
      return res.status(200).send({ message: "Edit successful", member });
    }

    // Edit User Credentials
    if (req?.file) {
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

    const user = await Member.findOneAndUpdate({ slug }, updates, {
      new: true,
    }).select("-password");

    if (user) return res.status(200).send({ message: "Edit successful", user });
    else return res.status(404).send({ message: "Edit failed" });
  } catch (err) {
    console.log("Error editing user - ", getDate(), "\n---\n", err);
    if (err.codeName === "DuplicateKey") {
      return res
        .status(409)
        .send({ message: "Email has already been taken", subject: "email" });
    }
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const slug = req.body?.slug;
    if (!slug) return res.status(400).send({ message: "Invalid request" });

    const member = await Member.findOneAndDelete({ slug });
    if (!member) return res.status(404).send({ message: "Member not found" });

    console.log("Member deleted successfully -", getDate(), "\n---\n");
    deleteImage(res, member.imgId);
    res.status(200).send({ message: "Member deleted successfully" });
  } catch (err) {
    console.log("Error deleting member - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = {
  verifyUser,
  getMember,
  editMember,
  getAllMembers,
  deleteMember,
};
