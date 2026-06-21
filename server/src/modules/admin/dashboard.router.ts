import express from "express";
import { getDashboardData } from "./admin.controller.js";
import {
  isAuthorized,
  requireMinimumRole,
} from "../../shared/middlewares/auth-middleware.js";
import { ROLES } from "../../shared/utils/roles.js";

const dashboardRouter = express.Router();

// dashboard routes
dashboardRouter.get(
  "/data",
  isAuthorized,
  requireMinimumRole(ROLES.EXECUTIVE),
  getDashboardData,
);

export default dashboardRouter;
