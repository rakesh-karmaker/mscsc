const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const bcrypt = require("bcryptjs");

// Get All Members
const getAllMembers = async (req, res) => {
  try {
    console.log("get all members");
    const members = await Member.find().sort({ _id: -1 }).select("-password");

    console.log("get all members", members);
    res.send(members);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

// Get User
const getUser = async (req, res) => {
  console.log("get user");
  try {
    // Authenticate User
    const prefix = "Bearer ";
    const token = req.header("Authorization").split(prefix)[1];
    if (!token) return res.status(401).send({ message: "Access Denied" });

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
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

const getUserById = async (req, res) => {
  const _id = req.params?._id;
  console.log("get user by id", _id);
  if (!_id) {
    return res.status(400).send({ message: "Invalid request" });
  }

  try {
    const user = await Member.findById(_id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user._id = user._id.toString();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err?.message });
  }
};

const editUser = async (req, res) => {
  try {
    // Authenticate User
    const prefix = "Bearer ";
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).send({ message: "Access Denied" });
    const token = authHeader.split(prefix)[1];
    if (!token) return res.status(401).send({ message: "Access Denied" });

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    // Edit User Timeline
    if (req.body && req.body.timeline) {
      const timeline = JSON.parse(req.body.timeline);
      const user = await Member.findOneAndUpdate(
        { _id },
        { timeline },
        { new: true }
      );
      if (!user) return res.status(404).send({ message: "User not found" });
      return res.status(200).send({ message: "Edit successful" });
    }

    // Edit User Credentials
    const previousUser = await Member.findById(_id);
    if (!previousUser)
      return res.status(404).send({ message: "User not found" });

    if (req.body && req.body.password === "") {
      req.body.password = previousUser.password;
    } else if (req.body && req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const user = await Member.findOneAndUpdate({ _id }, req.body, {
      new: true,
    });

    if (user) return res.status(200).send({ message: "Edit successful" });
    else return res.status(404).send({ message: "Edit failed" });
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res
        .status(400)
        .send({ message: "Email has already been taken", subject: "email" });
    }
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = { getUser, editUser, getUserById, getAllMembers };
