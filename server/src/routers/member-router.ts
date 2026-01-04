import express from "express";
import {
  deleteMember,
  editMember,
  getAllMembers,
  getMember,
  getTopSubmitters,
} from "../controllers/member-controller.js";
import upload from "../middlewares/multer.js";
import { isAdmin, isAuthorized } from "../middlewares/auth-middleware.js";

const memberRouter = express.Router();

// Member Routes
memberRouter.get("/all", getAllMembers);
memberRouter.get("/top-submitters", getTopSubmitters);
memberRouter.get("/:slug", getMember);

memberRouter.patch(
  "/edit-member",
  isAuthorized,
  upload.single("image"),
  editMember
);

memberRouter.delete("/:slug", isAuthorized, isAdmin, deleteMember);

export default memberRouter;
