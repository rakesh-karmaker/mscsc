import { Request, Response } from "express";
import Member from "../models/Member.js";
import { GetAllMembersRegexType } from "../types/member-types.js";
import paginateResults from "../lib/paginate-results.js";
import { deleteImage, uploadImage } from "../lib/image-uploader.js";
import { generateHash } from "../utils/hash.js";

// Get all members
export async function getAllMembers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Create regex for filtering
    const regex: GetAllMembersRegexType = {
      name: new RegExp(
        typeof req.query.name === "string" ? req.query.name : "",
        "i"
      ),
      role: new RegExp(
        typeof req.query.role === "string" ? req.query.role : "",
        "i"
      ),
      branch: new RegExp(
        typeof req.query.branch === "string" ? req.query.branch : "",
        "i"
      ),
    };

    if (req.query.position && req.query.position === "executive") {
      // Create a regex that matches values except for the query value
      regex.position = new RegExp(`^(?!.*member).*$`, "i");
    }

    // Pagination and sorting options
    const sorted = {
      sort: { _id: -1 as 1 | -1 },
      select:
        "_id name slug batch branch image role position new isImageVerified isImageHidden", // Select only necessary fields
    };

    // Get paginated results
    const members = await paginateResults(req, Member, regex, sorted);
    members.adminLength = await Member.countDocuments({ role: "admin" });
    res.status(200).send(members);
  } catch (err) {
    console.log("Error getting all members - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Get member by slug
export async function getMember(req: Request, res: Response): Promise<void> {
  const slug = req.params?.slug;
  if (!slug) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }

  try {
    const member = await Member.findOne({ slug }).select("-password");
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    res.send(member);
  } catch (err) {
    console.log("Error getting member - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Get top 10 members with most submissions
export async function getTopSubmitters(
  _: Request,
  res: Response
): Promise<void> {
  try {
    const members = await Member.find();
    const topSubmitters = members
      .map((member) => ({
        _id: member._id,
        name: member.name,
        branch: member.branch,
        batch: member.batch,
        slug: member.slug,
        image: member.image,
        submissionCount: member.submissions ? member.submissions.length : 0,
        isImageHidden: member.isImageHidden,
      }))
      .sort((a, b) => b.submissionCount - a.submissionCount)
      .slice(0, 10); // Get top 10

    if (!topSubmitters || topSubmitters.length === 0) {
      res.status(404).send({ message: "No submitters found" });
      return;
    }

    res.status(200).send(
      topSubmitters.map((member) => ({
        _id: member._id,
        name: member.name,
        slug: member.slug,
        branch: member.branch,
        batch: member.batch,
        image: member.image,
        submissionCount: member.submissionCount,
        isImageHidden: member.isImageHidden,
      }))
    );
  } catch (err) {
    console.log("Error getting top submitters - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Edit member details
export async function editMember(req: Request, res: Response): Promise<void> {
  try {
    const { slug, ...updates } = req.body;

    // Validate slug
    if (!slug || typeof slug !== "string") {
      res.status(400).send({ message: "Invalid request" });
      return;
    }

    // Check if member exists
    const previousUser = await Member.findOne({ slug });
    if (!previousUser) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // check if the user is trying to change email address
    if (updates && updates.email && updates.email !== previousUser.email) {
      const emailExists = await Member.findOne({ email: updates.email });
      if (emailExists) {
        res.status(409).send({ message: "Email already in use" });
        return;
      }
    }

    // Authorization: only the user themselves or an admin can edit
    if (previousUser._id.toString() !== req.user?._id) {
      const adminData = await Member.findById(req.user?._id);
      console.log(`Mismatched id - ${adminData?.name} - ${req.user?._id}`);
      if (!adminData || adminData?.role !== "admin") {
        res.status(401).send({ message: "Access Denied" });
        return;
      }
    }

    // Update User Timeline
    if (updates && updates.timeline) {
      const timeline = JSON.parse(updates.timeline);
      const updatedMember = await Member.findOneAndUpdate(
        { slug },
        { timeline: timeline },
        { new: true }
      ).select("-password");

      // return updated member
      res
        .status(200)
        .send({ message: "Edit successful", member: updatedMember });
      return;
    }

    // Update image if new image is uploaded
    if (req?.file) {
      deleteImage(previousUser.imgId);
      const { url, imgId } = await uploadImage(req.file);
      updates.image = url;
      updates.imgId = imgId;
      updates.new = true; // Once edited, set new to true
    }

    // If password is empty string, retain previous password
    if (updates?.password === "") {
      updates.password = previousUser.password;
    } else if (updates && updates.password) {
      updates.password = await generateHash(updates.password);
    }

    // Trim certain fields
    updates.batch = updates.batch?.trim();
    updates.name = updates.name?.trim();
    updates.branch = updates.branch?.trim();

    const user = await Member.findOneAndUpdate({ slug }, updates, {
      isImageVerified: false, // Reset image verification on edit
      new: true,
    }).select("-password");

    res.status(200).send({ message: "Edit successful", user });
  } catch (err) {
    console.log("Error editing member - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

// Delete member
export async function deleteMember(req: Request, res: Response): Promise<void> {
  const slug = req.params?.slug;
  if (!slug) {
    res.status(400).send({ message: "Invalid request" });
    return;
  }

  try {
    // Delete member from DB
    const member = await Member.findOneAndDelete({ slug });
    if (!member) {
      res.status(404).send({ message: "Member not found" });
      return;
    }

    // Delete member image from imageKit
    if (member.imgId) {
      deleteImage(member.imgId);
    }

    console.log(`Member deleted - ${member.name} - ${member._id}`);
    res.status(200).send({ message: "Member deleted successfully" });
  } catch (err) {
    console.log("Error deleting member - ", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}
