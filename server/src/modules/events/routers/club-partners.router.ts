import { Router } from "express";
import {
  changeClubPartnerStatus,
  createClubPartner,
  deleteClubPartner,
  editClubPartner,
  getClubAllPartners,
  getClubPartnerById,
} from "../controllers/club-partners.controller.js";

const clubPartnersRouter = Router();

//* club partners routes

clubPartnersRouter.get("/:eventSlug/partners", getClubAllPartners);
clubPartnersRouter.post("/:eventSlug/:partnerId", getClubPartnerById);

clubPartnersRouter.post("/:eventSlug/create", createClubPartner);
clubPartnersRouter.patch(
  "/:eventSlug/:partnerId/change-status",
  changeClubPartnerStatus,
);
clubPartnersRouter.put("/:eventSlug/:partnerId/edit", editClubPartner);

clubPartnersRouter.delete("/:eventSlug/:partnerId/delete", deleteClubPartner);

export default clubPartnersRouter;
