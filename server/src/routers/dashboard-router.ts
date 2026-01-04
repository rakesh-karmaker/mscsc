import express from "express";
import { getDashboardData } from "../controllers/admin-controller.js";
import { isAdmin, isAuthorized } from "../middlewares/auth-middleware.js";

const dashboardRouter = express.Router();

// dashboard routes
dashboardRouter.get("/data", isAuthorized, isAdmin, getDashboardData);

export default dashboardRouter;
