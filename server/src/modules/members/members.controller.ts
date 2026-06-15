import { Request, Response } from "express";
import Member from "../../shared/models/member.model.js";
import { GetAllMembersRegexType } from "./member.types.js";
import paginateResults from "../../shared/lib/paginate-results.js";
import { deleteFile, uploadImage } from "../../shared/lib/file-uploader.js";
import { generateHash } from "../../shared/utils/hash.js";
import logger from "../../shared/config/winston.js";

// Get all members
export async function getAllMembers(
  req: Request,
  res: Response,
): Promise<void> {
  const params = req.query as {
    page?: string;
    limit?: string;
    name?: string;
    branch?: string;
  };

  // Create regex for filtering
  const regex: GetAllMembersRegexType = {
    name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
    branch: new RegExp(
      typeof params.branch === "string" ? params.branch : "",
      "i",
    ),
  };

  // Pagination and sorting options
  const sorted = {
    sort: { createdAt: -1 as 1 | -1 },
    select:
      "_id name slug batch branch image role position new isImageVerified isImageHidden createdAt", // Select only necessary fields
  };

  try {
    // Get paginated results
    const members = await paginateResults(req, Member, regex, sorted);
    members.adminLength = await Member.countDocuments({ role: "admin" });
    res.status(200).send(members);
  } catch (err) {
    logger.error("Error fetching members", {
      error: err instanceof Error ? err.message : String(err),
    });
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
  }
}

export async function getAllMembersForTable(
  req: Request,
  res: Response,
): Promise<void> {
  const branches = [
    "Main Boys",
    "Main Girls",
    "Branch - 1",
    "Branch - 2",
    "Branch - 3",
  ] as const;
  // const positions = ["member", "admin"] as const; TODO: add more positions

  const params = req.query as {
    page?: string;
    perPage?: string;
    name?: string;
    batch?: string;
    branch?: (typeof branches)[number][];
    position?: string[];
    sort?: string;
  };

  try {
    // const params = req.query;

    // Parse and validate query parameters
    const page = params.page ? parseInt(params.page) : 1;
    const perPage = params.perPage ? parseInt(params.perPage) : 10;
    const skip = (page - 1) * perPage;
    const batchFilter =
      typeof params.batch === "string"
        ? {
            $eq: parseInt(params.batch),
          }
        : {};
    const branchesFilter =
      Array.isArray(params.branch) && params.branch.length > 0
        ? { $in: params.branch }
        : {};
    const branch = Array.isArray(params.branch) ? params.branch : [];
    const positions = Array.isArray(params.position) ? params.position : [];
    const sort: { id: string; desc: boolean } | {} =
      Array.isArray(params.sort) && params.sort.length > 0
        ? params.sort[0]
        : {};

    // Create regex for filtering
    const regex: Pick<GetAllMembersRegexType, "name"> = {
      name: new RegExp(typeof params.name === "string" ? params.name : "", "i"),
    };

    // fetch members based on filters
    const members = await Member.find({
      ...regex,
      ...batchFilter,
      ...branchesFilter,
      ...(positions.length > 0 &&
        positions.includes("executive") && {
          position: new RegExp(`^(?!.*member).*$`, "i"),
        }),
      ...(positions.length > 0 &&
        (positions.includes("member") || positions.includes("admin")) && {
          role: { $in: positions },
        }),
    })
      .sort(
        sort && Object.keys(sort).length > 0 && "id" in sort && "desc" in sort
          ? { [String(sort.id)]: sort.desc.toString() === "true" ? -1 : 1 }
          : { createdAt: -1 },
      )
      .select(
        "_id name slug email batch branch image role position contactNumber socialLink new isImageVerified isImageHidden createdAt",
      );

    const selectedMemberCount = members.length;
    const paginatedMembers = members.slice(skip, skip + perPage);

    res
      .status(200)
      .send({ results: paginatedMembers, selectedCount: selectedMemberCount });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching members for table", {
      error: err instanceof Error ? err.message : String(err),
    });
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
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching member", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// Get top 10 members with most submissions
export async function getTopSubmitters(
  _: Request,
  res: Response,
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
      })),
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error fetching top submitters", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// Edit member details
export async function editMember(req: Request, res: Response): Promise<void> {
  const isAdminEdit = req.path.includes("/admin/");

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

    if (!isAdminEdit) {
      // check if the user is trying to change email address
      if (updates && updates.email && updates.email !== previousUser.email) {
        const emailExists = await Member.findOne({ email: updates.email });
        if (emailExists) {
          res.status(409).send({ message: "Email already in use" });
          return;
        }
      }

      // Authorization: only the user themselves or an admin can edit
      if (previousUser._id.toString() != req.user?._id.toString()) {
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
          { new: true },
        ).select("-password");

        // return updated member
        res
          .status(200)
          .send({ message: "Edit successful", member: updatedMember });
        return;
      }

      // Update image if new image is uploaded
      if (req?.file) {
        deleteFile(previousUser.imgId);
        const { url, imgId } = await uploadImage(req.file, true, "members");
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
      updates.batch =
        parseInt(updates.batch?.trim() || "") || previousUser.batch;
      updates.name = updates.name?.trim() || previousUser.name;
      updates.branch = updates.branch?.trim() || previousUser.branch;
    }

    if (updates.position || updates.role || updates.isImageVerified) {
      const editor = await Member.findById(req.user?._id);
      if (!editor || editor.role !== "admin" || !isAdminEdit) {
        res.status(401).send({ message: "Access Denied" });
        logger.warn("Unauthorized member role or position edit attempt", {
          attemptedBy: req.user?._id,
          memberEdited: previousUser._id,
        });
        return;
      }

      updates.position = updates.position?.trim() || previousUser.position;
      logger.info("Member role or position edited", {
        memberId: previousUser?._id,
        memberName: previousUser?.name,
        editor: req.user?._id,
      });
    }

    const user = await Member.findOneAndUpdate({ slug }, updates, {
      isImageVerified: false, // Reset image verification on edit
      new: true,
    }).select("-password");

    res.status(200).send({ message: "Edit successful", user });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error editing member", {
      memberId: req.user?._id,
      error: err instanceof Error ? err.message : String(err),
      editor: req.user?._id,
    });
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
      deleteFile(member.imgId);
    }

    res.status(200).send({ message: "Member deleted successfully" });
    logger.info("Member deleted", {
      memberId: member._id,
      memberName: member.name,
      deletedBy: req.user?._id,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res
      .status(500)
      .send({ subject: "root", message: "Server error", error: errorMessage });
    logger.error("Error deleting member", {
      memberId: req.user?._id,
      error: err instanceof Error ? err.message : String(err),
      deletedBy: req.user?._id,
    });
  }
}
