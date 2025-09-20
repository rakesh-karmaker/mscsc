import { Request, Response } from "express";
import generateSlug from "../utils/generateSlug.js";
import Member from "../models/Member.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import getDate from "../utils/getDate.js";
import { registerSchema } from "../lib/validation/authSchema.js";
import { uploadImage } from "../lib/imageUploader.js";
import { compareHash, generateHash } from "../utils/hash.js";
import { NewMemberDataType } from "../types/memberTypes.js";

const JWT_EXPIRATION = "30d"; // Token valid for 30 days

// Register a new member
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { file, body } = req;
    if (!file || !body) {
      res.status(400).send({ subject: "request", message: "Invalid request" });
      return;
    }

    // validate the request body
    body.email = body?.email?.toLowerCase()?.trim();
    body.name = body.name.trim();
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
    const { url, imgId } = await uploadImage(file, true);
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
      batch: body.batch,
      branch: body.branch,
      reason: body.reason,
      socialLink: body.socialLink,
      reference: body.reference,
      password: hashedPassword,
      image: url,
      imgId: imgId,
    };
    const newMember = await Member.create(newMemberData);

    // generate JWT token
    const token = jwt.sign({ _id: newMember._id }, config.jwtSecret, {
      expiresIn: JWT_EXPIRATION,
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
    const member = await Member.findOne({ email });
    if (!member) {
      res.status(404).send({ subject: "email", message: "Invalid email" });
      return;
    }

    // compare the password
    const isPasswordMatch = await compareHash(rawPassword, member.password);
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
    console.log("Error logging in member - ", getDate(), "\n---\n", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
