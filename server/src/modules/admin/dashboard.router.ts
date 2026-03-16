import express from "express";
import { getDashboardData } from "./admin.controller.js";
import {
  isAdmin,
  isAuthorized,
} from "../../shared/middlewares/auth-middleware.js";

const dashboardRouter = express.Router();

// dashboard routes
dashboardRouter.get("/data", isAuthorized, isAdmin, getDashboardData);

export default dashboardRouter;
