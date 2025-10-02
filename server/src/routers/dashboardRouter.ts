import express from "express";
import { getDashboardData } from "../controllers/adminController.js";
import { isAdmin, isAuthorized } from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

// dashboard routes
dashboardRouter.get("/data", isAuthorized, isAdmin, getDashboardData);

export default dashboardRouter;
