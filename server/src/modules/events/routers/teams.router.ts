import { Router } from "express";
import {
  createSegmentTeam,
  deleteSegmentTeam,
  getAllTeams,
  getTeamById,
  updateSegmentTeamStatus,
} from "../controllers/teams.controller.js";
import {
  isAdmin,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";

const teamsRouter = Router();

// team routes
teamsRouter.get("/:eventSlug/", isAuthorized, getAllTeams);
teamsRouter.get("/:eventSlug/:teamId", isAuthorized, getTeamById);

teamsRouter.post("/:eventSlug/create", isAuthorized, createSegmentTeam);

teamsRouter.patch(
  "/:eventSlug/:teamId/update-status",
  isAuthorized,
  isAdmin,
  updateSegmentTeamStatus,
);

teamsRouter.delete(
  "/:eventSlug/:teamId",
  isAuthorized,
  isAdmin,
  deleteSegmentTeam,
);

export default teamsRouter;
