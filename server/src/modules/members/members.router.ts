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
  requireMinimumRole,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";
import { ROLES } from "../../shared/utils/roles.js";

const membersRouter = express.Router();

// Member Routes
membersRouter.get("/all", getAllMembers);
membersRouter.get(
  "/all-table",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getAllMembersForTable,
);
membersRouter.get("/top-submitters", getTopSubmitters);
membersRouter.get("/:slug", getMember);

membersRouter.patch(
  "/edit-member",
  isAuthorized,
  upload.single("image"),
  editMember,
);
membersRouter.patch(
  "/admin/edit-member",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  editMember,
);

membersRouter.delete(
  "/:slug",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteMember,
);

export default membersRouter;
