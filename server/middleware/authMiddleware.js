const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// Verify if user is admin
exports.isAuthorized = async (req, res, next) => {
  try {
    const prefix = "Bearer ";
    const token = req.header("Authorization").split(prefix)[1];
    if (!token) return res.status(401).send({ message: "Access Denied" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).send({ message: "Access Denied" });
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  const member = await Member.findById(req.user._id);
  if (!member) return res.status(404).send({ message: "Member not found" });
  if (member.role !== "admin")
    return res.status(401).send({ message: "Access Denied" });
  next();
};
