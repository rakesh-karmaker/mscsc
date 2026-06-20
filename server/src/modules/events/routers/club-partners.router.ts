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

const clubPartnersRouter = Router();

//* club partners routes

clubPartnersRouter.get("/:eventSlug/partners", getClubAllPartners);
clubPartnersRouter.get("/:eventSlug/:partnerId", getClubPartnerById);

clubPartnersRouter.post(
  "/:eventSlug/create",
  upload.single("clubLogo"),
  createClubPartner,
);
clubPartnersRouter.patch(
  "/:eventSlug/:partnerId/change-status",
  changeClubPartnerStatus,
);
clubPartnersRouter.put(
  "/:eventSlug/:partnerId/edit",
  upload.single("clubLogo"),
  editClubPartner,
);

clubPartnersRouter.delete("/:eventSlug/:partnerId/delete", deleteClubPartner);

export default clubPartnersRouter;
