const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const bcrypt = require("bcryptjs");

// Get User
const getUser = async (req, res) => {
  console.log("get user");
  try {
    const prefix = "Bearer ";
    const token = req.header("Authorization").split(prefix)[1];

    if (!token) return res.status(401).send({ message: "Access Denied" });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    user._id = user._id.toString();

    res.send({
      user,
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    console.log(req.body.timeline);
    const prefix = "Bearer ";
    const token = req.header("Authorization").split(prefix)[1];

    if (!token) return res.status(401).send({ message: "Access Denied" });

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (req.body?.timeline) {
      console.log("timeline");
      const timeline = JSON.parse(req.body.timeline);
      const user = await Member.findOneAndUpdate(
        { _id: id },
        { timeline },
        {
          new: true,
        }
      );
      if (!user) return res.status(404).send({ message: "User not found" });
      console.log(user);
      return res.status(200).send({ message: "Edit successful" });
    }

    const previousUser = await Member.findById(id);
    if (!previousUser)
      return res.status(404).send({ message: "User not found" });
    if (req.body.password && req.body.password == "") {
      req.body.password = previousUser.password;
      console.log("password is empty");
    } else {
      if (req.body?.password)
        req.body.password = await bcrypt.hashSync(req.body.password, 10);
    }

    const user = await Member.findOneAndUpdate({ _id: id }, req.body, {
      new: true, // Return the new document instead of the old one
    });

    const newUser = await Member.findById(id);
    console.log(newUser);

    if (user) return res.status(200).send({ message: "Edit successful" });
    else return res.status(404).send({ message: "Edit failed" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await Member.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });
    user._id = user._id.toString();
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};

module.exports = { getUser, editUser, getUserById };
