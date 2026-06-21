import { Router } from "express";
import {
  changeClubPartnerStatus,
  createClubPartner,
  deleteClubPartner,
  editClubPartner,
  getClubAllPartners,
  getClubPartnerById,
} from "../controllers/club-partners.controller.js";
import upload from "../../../shared/middlewares/multer.js";
import {
  isAuthorized,
  requireMinimumRole,
} from "../../../shared/middlewares/auth-middleware.js";
import { ROLES } from "../../../shared/utils/roles.js";

const clubPartnersRouter = Router();

//* club partners routes

clubPartnersRouter.get(
  "/:eventSlug/partners",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getClubAllPartners,
);
clubPartnersRouter.get(
  "/:eventSlug/:partnerId",
  isAuthorized,
  requireMinimumRole(ROLES.OBSERVER),
  getClubPartnerById,
);

clubPartnersRouter.post(
  "/:eventSlug/create",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  upload.single("clubLogo"),
  createClubPartner,
);
clubPartnersRouter.patch(
  "/:eventSlug/:partnerId/change-status",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  changeClubPartnerStatus,
);
clubPartnersRouter.put(
  "/:eventSlug/:partnerId/edit",
  isAuthorized,
  requireMinimumRole(ROLES.EDITOR),
  upload.single("clubLogo"),
  editClubPartner,
);

clubPartnersRouter.delete(
  "/:eventSlug/:partnerId/delete",
  isAuthorized,
  requireMinimumRole(ROLES.ADMIN),
  deleteClubPartner,
);

export default clubPartnersRouter;
