const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");
const { registerSchema } = require("../utils/validation");
const { uploadImage } = require("../utils/imagekit");
const { getDate } = require("../utils/getDate");
const generateSlug = require("../utils/generateSlug");

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

    // generate the member slug
    const slug = await generateSlug(body.name, Member);
    body.slug = slug;
    body.name = body.name.trim();

    const { url, imgId } = await uploadImage(res, file);
    if (!url) {
      throw new Error("No image URL found");
    }

    body.image = url;
    body.imgId = imgId;

    const existingMember = await Member.findOne({ email: body.email });
    if (existingMember) {
      return res
        .status(409)
        .send({ subject: "email", message: "Email already used before" });
    }

    const newMember = new Member(body);
    await newMember.save();

    const token = jwt.sign({ _id: newMember._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(
      `${newMember.name} registered successfully -`,
      getDate(),
      "\n---\n"
    );
    res.status(201).send({
      subject: "register",
      message: "Registered successfully.",
      token,
      member: newMember,
    });
  } catch (err) {
    console.log("Error registering member - ", getDate(), "\n---\n", err);
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

    const token = jwt.sign({ _id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log(
      `${member.name} logged in successfully -`,
      getDate(),
      "\n---\n"
    );
    res.status(200).send({
      subject: "login",
      message: "Logged in successfully.",
      token,
      member,
    });
  } catch (err) {
    console.log("Error logging in - ", getDate(), "\n---\n", err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
