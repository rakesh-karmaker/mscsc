import { Router } from "express";
import {
  deleteSegmentTeam,
  getAllTeams,
  getTeamById,
  updateSegmentTeam,
} from "../controllers/teams.controller.js";
import {
  isAdmin,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";

const teamsRouter = Router();

// team routes
teamsRouter.get("/:eventSlug/teams", isAuthorized, getAllTeams);
teamsRouter.get("/:eventSlug/teams/:teamId", isAuthorized, getTeamById);

teamsRouter.patch(
  "/:eventSlug/teams/:teamId",
  isAuthorized,
  isAdmin,
  updateSegmentTeam,
);

teamsRouter.delete(
  "/:eventSlug/teams/:teamId",
  isAuthorized,
  isAdmin,
  deleteSegmentTeam,
);

export default teamsRouter;
