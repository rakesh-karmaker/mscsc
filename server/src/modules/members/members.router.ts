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

const membersRouter = express.Router();

// Member Routes
membersRouter.get("/all", getAllMembers);
membersRouter.get("/all-table", getAllMembersForTable);
membersRouter.get("/top-submitters", getTopSubmitters);
membersRouter.get("/:slug", getMember);

membersRouter.patch(
  "/edit-member",
  isAuthorized,
  upload.single("image"),
  editMember,
);
membersRouter.patch("/admin/edit-member", isAuthorized, isAdmin, editMember);

membersRouter.delete("/:slug", isAuthorized, isAdmin, deleteMember);

export default membersRouter;
