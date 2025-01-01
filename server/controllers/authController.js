const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");
const { registerSchema } = require("../utils/validation");
const imagekit = require("../utils/imagekit");

// Register Member
exports.register = async (req, res) => {
  try {
    const { file, body } = req;
    if (!file || !body) {
      return res
        .status(400)
        .send({ subject: "request", message: "Invalid request" });
    }

    const { error: validationError } = registerSchema.validate(body);
    if (validationError) {
      return res.status(400).send({
        subject: validationError.details[0].context.key,
        message: validationError.details[0].message,
      });
    }

    const uploadPromise = imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
    });

    const imgRes = await uploadPromise;
    console.log(imgRes);
    const url = imgRes.url;
    if (!url) {
      throw new Error("No image URL found");
    }

    body.image = url;
    body.imgId = imgRes.fileId;

    const existingMember = await Member.findOne({ email: body.email });
    if (existingMember) {
      return res
        .status(400)
        .send({ subject: "email", message: "Email already used before" });
    }

    const newMember = new Member(body);
    await newMember.save();

    const token = jwt.sign(
      { _id: newMember._id, role: newMember.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Member registered successfully.");

    res.status(201).send({ message: "Member registered successfully.", token });
  } catch (err) {
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: err.message });
  }
};

// Login Member
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });
    if (!member) {
      return res
        .status(404)
        .send({ subject: "email", message: "Invalid email" });
    }

    const isPasswordMatch = await bcrypt.compare(password, member.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ subject: "password", message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: member._id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Member logged in successfully.");
    res.send({ token });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
