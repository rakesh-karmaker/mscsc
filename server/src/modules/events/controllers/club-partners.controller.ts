import { Request, Response } from "express";
import logger from "../../../shared/config/winston.js";
import Event from "../models/event.model.js";
import EventRegistration from "../models/event-registration.model.js";
import ClubPartner from "../models/club-partner.model.js";
import { deleteFile, uploadImage } from "../../../shared/lib/file-uploader.js";
import { clubPartnerSchema } from "../schemas/club-partner.schema.js";
import mongoose from "mongoose";

// get all the club partners for an event
export async function getClubAllPartners(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug } = req.params;
  if (!eventSlug) {
    res.status(400).json({ message: "Event slug is required" });
    return;
  }

  const params = req.query as {
    page?: string;
    perPage?: string;
    name?: string;
    status?: string | string[];
  };

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // parse and validate query params
    const page = params.page ? parseInt(params.page, 10) + 1 : 1;
    const perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePerPage =
      Number.isNaN(perPage) || perPage < 1 ? 10 : Math.min(perPage, 100);
    const skip = (safePage - 1) * safePerPage;
    const statuses = Array.isArray(params.status)
      ? params.status
      : params.status
        ? [params.status]
        : [];

    const filterStage: Record<string, unknown> = {};
    if (typeof params.name === "string" && params.name.trim()) {
      filterStage.clubName = new RegExp(params.name.trim(), "i");
    }
    if (statuses.length > 0) {
      filterStage.status = { $in: statuses };
    }

    // 1) Rank all partners in the event by score, 2) then filter, 3) then paginate.
    const [aggregationResult] = await ClubPartner.aggregate([
      { $match: { eventId: event._id } },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: {
            position: { $documentNumber: {} },
          },
        },
      },
      ...(Object.keys(filterStage).length > 0 ? [{ $match: filterStage }] : []),
      {
        $project: {
          _id: 1,
          clubName: 1,
          clubLogoUrl: 1,
          facebookUrl: 1,
          code: 1,
          status: 1,
          score: 1,
          position: 1,
        },
      },
      {
        $facet: {
          results: [{ $skip: skip }, { $limit: safePerPage }],
          count: [{ $count: "selectedCount" }],
        },
      },
    ]);

    const selectedCount = aggregationResult?.count?.[0]?.selectedCount || 0;
    const results = aggregationResult?.results || [];

    res.status(200).json({ results, selectedCount });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching club partners", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
    });
  }
}

// get a specific club partner by id
export async function getClubPartnerById(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug, partnerId } = req.params;
  if (!eventSlug || !partnerId) {
    res.status(400).json({ message: "Event slug and partner ID are required" });
    return;
  }

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    //1) rank all partners in the event by score, 2) find the partner by id, 3) get the registrations for that partner
    const [aggregationResult] = await ClubPartner.aggregate([
      { $match: { eventId: event._id } },
      {
        $setWindowFields: {
          sortBy: { score: -1 },
          output: { position: { $documentNumber: {} } },
        },
      },
      { $match: { _id: new mongoose.Types.ObjectId(partnerId) } },
      {
        $project: {
          _id: 1,
          clubName: 1,
          clubLogoUrl: 1,

          clubEmail: 1,
          phoneNumber: 1,
          facebookUrl: 1,

          institution: 1,
          address: 1,

          moderatorName: 1,
          moderatorEmail: 1,
          moderatorPhoneNumber: 1,

          code: 1,
          status: 1,
          score: 1,
          position: 1,

          createdAt: 1,
        },
      },
    ]);
    if (!aggregationResult) {
      res.status(404).json({ message: "Club partner not found" });
      return;
    }

    // get the registrations
    const registrations = await EventRegistration.find({
      eventId: event._id,
      clubPartnerId: aggregationResult._id,
    })
      .lean()
      .select("_id name email photoUrl status");

    res.status(200).json({
      clubPartnerDetails: aggregationResult,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error fetching club partner by ID", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
      partnerId,
    });
  }
}

// create a new club partner for an event
export async function createClubPartner(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug } = req.params;
  let fileId: string | null = null;
  if (!eventSlug) {
    res.status(400).json({ message: "Event slug is required" });
    return;
  }

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    const body = req.body;
    const file = req.file;

    const { error: clubPartnerValidationError } =
      clubPartnerSchema.validate(body);
    if (clubPartnerValidationError) {
      res.status(400).json({ message: clubPartnerValidationError.message });
      return;
    }

    if (!file) {
      res.status(400).json({ message: "Club logo is required" });
      return;
    }

    const existingPartnerWithCode = await ClubPartner.findOne({
      eventId: event._id,
      code: body.code,
    });
    if (existingPartnerWithCode) {
      res.status(400).json({ message: "Code must be unique" });
      return;
    }

    const { url, imgId } = await uploadImage(file, true, "club-partners");
    fileId = imgId;
    await ClubPartner.create({
      eventId: new mongoose.Types.ObjectId(event._id),
      clubName: body.clubName,
      clubEmail: body.clubEmail,
      phoneNumber: body.phoneNumber,
      facebookUrl: body.facebookUrl,
      institution: body.institution,
      address: body.address,
      moderatorName: body.moderatorName || "",
      moderatorEmail: body.moderatorEmail || "",
      moderatorPhoneNumber: body.moderatorPhoneNumber || "",
      code: body.code,
      clubLogoUrl: url,
      clubLogoPublicId: imgId,
    });

    logger.info("Club partner created", {
      eventSlug,
      clubName: body.clubName,
      requestId: req.user?._id,
    });

    res.status(201).json({ message: "Club partner created successfully" });
  } catch (error) {
    if (fileId) {
      await deleteFile(fileId);
    }

    res.status(500).json({ message: "Internal server error" });
    logger.error("Error creating club partner", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
    });
  }
}

// change club partner status to active or inactive
export async function changeClubPartnerStatus(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug, partnerId } = req.params;
  const { status } = req.body;
  if (!eventSlug || !partnerId) {
    res.status(400).json({ message: "Event slug and partner ID are required" });
    return;
  }
  if (status !== "active" && status !== "inactive") {
    res
      .status(400)
      .json({ message: "Status must be either active or inactive" });
    return;
  }

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // find club partner
    const clubPartner = await ClubPartner.findOne({
      _id: partnerId,
      eventId: event._id,
    });
    if (!clubPartner) {
      res.status(404).json({ message: "Club partner not found" });
      return;
    }

    clubPartner.status = status;
    await clubPartner.save();

    res
      .status(200)
      .json({ message: "Club partner status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error changing club partner status", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
      partnerId,
      newStatus: status,
      requestId: req.user?._id,
    });
  }
}

// edit a club partner's details
export async function editClubPartner(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug, partnerId } = req.params;
  if (!eventSlug || !partnerId) {
    res.status(400).json({ message: "Event slug and partner ID are required" });
    return;
  }
  let fileId: string | null = null;

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // find club partner
    const clubPartner = await ClubPartner.findOne({
      _id: partnerId,
      eventId: event._id,
    });
    if (!clubPartner) {
      res.status(404).json({ message: "Club partner not found" });
      return;
    }

    const body = req.body;
    const file = req.file;

    const { error: clubPartnerValidationError } =
      clubPartnerSchema.validate(body);
    if (clubPartnerValidationError) {
      res.status(400).json({ message: clubPartnerValidationError.message });
      return;
    }

    if (body.code && body.code !== clubPartner.code) {
      // check if code is unique
      const existingPartnerWithCode = await ClubPartner.findOne({
        eventId: event._id,
        code: body.code,
        _id: { $ne: clubPartner._id },
      });
      if (existingPartnerWithCode) {
        res.status(400).json({ message: "Code must be unique" });
        return;
      }
    }

    if (file) {
      await deleteFile(clubPartner.clubLogoPublicId);
      const { url, imgId } = await uploadImage(file, true, "club-partners");
      clubPartner.clubLogoUrl = url;
      clubPartner.clubLogoPublicId = imgId;
      fileId = imgId;
    }

    clubPartner.clubName = body.clubName;
    clubPartner.clubEmail = body.clubEmail;
    clubPartner.phoneNumber = body.phoneNumber;
    clubPartner.facebookUrl = body.facebookUrl;
    clubPartner.institution = body.institution;
    clubPartner.address = body.address;
    clubPartner.moderatorName = body.moderatorName || "";
    clubPartner.moderatorEmail = body.moderatorEmail || "";
    clubPartner.moderatorPhoneNumber = body.moderatorPhoneNumber || "";
    clubPartner.code = body.code;

    await clubPartner.save();

    res.status(200).json({ message: "Club partner updated successfully" });
  } catch (error) {
    if (fileId) {
      await deleteFile(fileId);
    }
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error editing club partner", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
      partnerId,
      requestId: req.user?._id,
    });
  }
}

// delete a club partner
export async function deleteClubPartner(
  req: Request,
  res: Response,
): Promise<void> {
  const { eventSlug, partnerId } = req.params;
  if (!eventSlug || !partnerId) {
    res.status(400).json({ message: "Event slug and partner ID are required" });
    return;
  }

  try {
    // find event
    const event = await Event.findOne({ eventSlug }).lean();
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // find club partner
    const clubPartner = await ClubPartner.findOne({
      _id: partnerId,
      eventId: event._id,
    });
    if (!clubPartner) {
      res.status(404).json({ message: "Club partner not found" });
      return;
    }

    await deleteFile(clubPartner.clubLogoPublicId);
    await clubPartner.deleteOne();

    logger.info("Club partner deleted", {
      eventSlug,
      clubName: clubPartner.clubName,
      requestId: req.user?._id,
    });

    res.status(200).json({ message: "Club partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    logger.error("Error deleting club partner", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      eventSlug,
      partnerId,
      requestId: req.user?._id,
    });
  }
}
