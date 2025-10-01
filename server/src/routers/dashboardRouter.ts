import express from "express";
import { getDashboardData } from "../controllers/adminController.js";

const dashboardRouter = express.Router();

// dashboard routes
dashboardRouter.get("/data", getDashboardData);

export default dashboardRouter;
