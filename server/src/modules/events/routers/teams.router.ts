import { Router } from "express";
import {
  createSegmentTeam,
  deleteSegmentTeam,
  getAllTeams,
  getTeamById,
  updateSegmentTeamStatus,
} from "../controllers/teams.controller.js";
import {
  requireMinimumRole,
  isAuthorized,
} from "../../../shared/middlewares/auth-middleware.js";
import { ROLES } from "../../../shared/utils/roles.js";

const teamsRouter = Router();

// team routes
teamsRouter.get(
  "/:eventSlug/",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getAllTeams,
);
teamsRouter.get(
  "/:eventSlug/:teamId",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getTeamById,
);

teamsRouter.post("/:eventSlug/create", isAuthorized, createSegmentTeam);

teamsRouter.patch(
  "/:eventSlug/:teamId/update-status",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  updateSegmentTeamStatus,
);

teamsRouter.delete(
  "/:eventSlug/:teamId",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteSegmentTeam,
);

export default teamsRouter;
