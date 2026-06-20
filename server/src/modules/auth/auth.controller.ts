import { Request, Response } from "express";
import generateSlug from "../../shared/utils/generate-slug.js";
import Member from "../../shared/models/member.model.js";
import jwt from "jsonwebtoken";
import config from "../../shared/config/config.js";
import { registerSchema } from "./auth.schema.js";
import { uploadImage } from "../../shared/lib/file-uploader.js";
import { compareHash, generateHash } from "../../shared/utils/hash.js";
import { NewMemberDataType } from "./auth.types.js";
import logger from "../../shared/config/winston.js";

const JWT_EXPIRATION = "1yr"; // Token valid for 1 year

// Register a new member
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { file, body } = req;
    if (!file || !body) {
      res.status(400).send({ subject: "request", message: "Invalid request" });
      return;
    }

    // validate the request body
    body.email = body.email.toLowerCase().trim();
    body.name = body.name.trim();
    body.batch = body.batch.trim();
    const { error: validationError } = registerSchema.validate(body);
    if (validationError) {
      res.status(400).send({
        subject: validationError.details[0].context?.key,
        message: validationError.details[0].message,
      });
      return;
    }

    // check if the email is already used
    const existingMember = await Member.findOne({ email: body.email });
    if (existingMember) {
      res
        .status(409)
        .send({ subject: "email", message: "Email already used before" });
      return;
    }

    // generate the member slug
    const slug = await generateSlug(body.name, Member);

    // upload and get the image URL and image ID
    const { url, imgId } = await uploadImage(file, true, "members");
    if (!url) {
      throw new Error("No image URL found");
    }

    // hash the password
    const hashedPassword = await generateHash(body.password);

    // create the new member
    const newMemberData: NewMemberDataType = {
      name: body.name,
      slug: slug,
      email: body.email,
      contactNumber: body.contactNumber,
      batch: parseInt(body.batch),
      branch: body.branch,
      reason: body.reason,
      socialLink: body.socialLink,
      reference: body.reference,
      password: hashedPassword,
      image: url,
      imgId: imgId,
      new: true,
    };
    const newMember = await Member.create(newMemberData).then((member) =>
      member?.toObject(),
    );

    const { password, ...memberData } = newMember;

    // generate JWT token
    const token = jwt.sign({ _id: newMember._id }, config.jwtSecret, {
      expiresIn: JWT_EXPIRATION,
    });

    res.status(201).send({
      subject: "register",
      message: "Registered successfully.",
      token,
      member: memberData,
    });

    logger.info(`New member registered - ${newMember.name}`, {
      memberId: newMember._id,
      memberName: newMember.name,
    });
  } catch (err) {
    logger.error("Error registering member", {
      error: err instanceof Error ? err.message : String(err),
    });
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Login an existing member
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password: rawPassword } = req.body;
    if (!email || !rawPassword) {
      res.status(400).send({ subject: "request", message: "Invalid request" });
      return;
    }

    // find the member by email
    const member = await Member.findOne({ email })
      .select("-imgId -reference -updatedAt -new -__v")
      .lean();
    if (!member) {
      res.status(404).send({ subject: "email", message: "Invalid email" });
      return;
    }
    const { password, ...memberData } = member;

    // compare the password
    const isPasswordMatch = await compareHash(rawPassword, password);
    if (!isPasswordMatch) {
      res
        .status(400)
        .send({ subject: "password", message: "Invalid password" });
      return;
    }

    // generate JWT token
    const token = jwt.sign({ _id: member._id }, config.jwtSecret, {
      expiresIn: JWT_EXPIRATION,
    });

    res.status(200).send({
      subject: "login",
      message: "Logged in successfully.",
      token,
      member: memberData,
    });
    logger.info(`Member logged in - ${member.name}`, {
      memberId: member._id,
      memberName: member.name,
    });
  } catch (err) {
    logger.error("Error logging in member", {
      error: err instanceof Error ? err.message : String(err),
    });
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// verify user and send user data
export async function verifyUser(req: Request, res: Response): Promise<void> {
  try {
    const data = req.user;
    const user = await Member.findById(data?._id || "")
      .select("-password -imgId -reference -updatedAt -new -__v")
      .lean();
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.send({
      user,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error verifying user", {
      error: errorMessage,
    });
  }
}
