import express from "express";
import {
  deleteMember,
  editMember,
  getAllMembers,
  getAllMembersForTable,
  getMember,
  getTopSubmitters,
} from "./members.controller.js";
import upload from "../../shared/middlewares/multer.js";
import {
  isAdmin,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";

const memberRouter = express.Router();

// Member Routes
memberRouter.get("/all", getAllMembers);
memberRouter.get("/all-table", getAllMembersForTable);
memberRouter.get("/top-submitters", getTopSubmitters);
memberRouter.get("/:slug", getMember);

memberRouter.patch(
  "/edit-member",
  isAuthorized,
  upload.single("image"),
  editMember,
);

memberRouter.delete("/:slug", isAuthorized, isAdmin, deleteMember);

export default memberRouter;
