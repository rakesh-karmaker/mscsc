const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");
const { registerSchema } = require("../utils/validation");
const { unlink } = require("fs/promises");

// Register Member
exports.register = async (req, res) => {
  try {
    if (!req.file || !req.body) {
      return res
        .status(400)
        .send({ subject: "request", message: "Invalid request" });
    }

    const image = req.file.path;
    const { error } = registerSchema.validate(req.body);
    if (error) {
      if (image) await unlink(image).catch(console.error);
      return res.status(400).send({
        subject: error.details[0].context.key,
        message: error.details[0].message,
      });
    }

    const { email } = req.body;
    req.body.image = image.split("public\\")[1];
    let member = await Member.findOne({ email });
    if (member) {
      if (image) await unlink(image).catch(console.error);
      return res
        .status(400)
        .send({ subject: "email", message: "Email already used before" });
    }

    const memberData = {
      ...req.body,
      image: image,
    };

    console.log(memberData);

    member = new Member({
      ...memberData,
    });
    await member.save();

    const token = jwt.sign(
      { id: member._id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(member);

    res.status(201).send({ message: "Member registered successfully.", token });
  } catch (err) {
    if (req.file && req.file.path)
      await unlink(req.file.path).catch(console.error);
    console.error(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: err.message });
  }
};

// Login Admin
exports.login = async (req, res) => {
  try {
    console.log(req);
    const { name, email, password } = req.body;
    const nameMember = await Member.findOne({ name });
    if (!nameMember)
      return res.status(404).send({ subject: "name", message: "Invalid Name" });

    const member = await Member.findOne({ email });
    if (!member)
      return res
        .status(404)
        .send({ subject: "email", message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, member.password);
    console.log(isMatch);
    if (!isMatch)
      return res
        .status(400)
        .send({ subject: "password", message: "Invalid Password" });

    const token = jwt.sign(
      { id: member._id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.send({ token });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
