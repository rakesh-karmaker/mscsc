const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Member = require("../models/Member");
const { registerSchema } = require("../utils/validation");
const { unlink } = require("fs/promises");
const imagekit = require("../utils/imagekit");

// Register Member
exports.register = async (req, res) => {
  try {
    if (!req.file || !req.body) {
      return res
        .status(400)
        .send({ subject: "request", message: "Invalid request" });
    }

    console.log(req.file);
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        subject: error.details[0].context.key,
        message: error.details[0].message,
      });
    }

    const { email } = req.body;
    const uploadPromise = new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: req.file.buffer,
          fileName: `${Date.now()}-${req.file.originalname}`,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = await uploadPromise;
    req.body.image = result.url;
    console.log(result);

    let member = await Member.findOne({ email });
    if (member) {
      return res
        .status(400)
        .send({ subject: "email", message: "Email already used before" });
    }

    const memberData = {
      ...req.body,
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
