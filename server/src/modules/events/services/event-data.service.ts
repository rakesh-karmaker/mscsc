import {
  EventDataType,
  FormDataType,
  SegmentType,
  SpType,
} from "../event.types.js";
import {
  uploadImage,
  uploadVideo,
  deleteFile,
} from "../../../shared/lib/file-uploader.js";
import urlChanger from "../utils/url-changer.js";

export async function buildEventData(
  body: any,
  files: { [fieldname: string]: Express.Multer.File[] },
  eventSlug: string,
  oldSlug?: string,
): Promise<EventDataType | null> {
  const isEdit = !!oldSlug;
  const eventData: EventDataType = {
    ...body.basicInfo,
    sections: body.sections,
    hiddenSections: body.hiddenSections,
    contactLinks: body.contactLinks,
    ...(body.basicInfo.hasCAForm ? { caFormData: body.caFormData } : {}),
  };

  // Form Data
  const formData: FormDataType = {
    registrationDeadline: body.formData.registrationDeadline,
  };
  if (eventData.isInnerRegistration) {
    formData.title = body.formData.title;
    formData.details = body.formData.details;
    formData.fees = body.formData.fees;
    eventData.fees = body.formData.fees;

    const platforms = body.formData.transactionPlatforms || [];

    // handle QR code files for inner registration
    const transactionMethods: {
      [method: string]: {
        number: string;
        qrCodeUrl?: string;
        qrCodePublicId?: string;
      };
    } = {};
    const qrCodeFields: { [key: string]: string } = {
      bkash: "bkashQrCode",
      nagad: "nagadQrCode",
      rocket: "rocketQrCode",
    };

    for (const transactionMethodsKey of Object.keys(
      body.formData.transactionMethods || {},
    )) {
      const methodData =
        body.formData.transactionMethods[transactionMethodsKey];

      if (isEdit && !platforms.includes(transactionMethodsKey)) {
        // if the transaction method is removed, delete the existing QR code file if it exists and continue to the next method
        if (methodData?.qrCodePublicId) {
          await deleteFile(methodData.qrCodePublicId || "");
        }
        continue;
      }

      if (
        methodData &&
        methodData.number &&
        files[qrCodeFields[transactionMethodsKey]] &&
        files[qrCodeFields[transactionMethodsKey]].length > 0
      ) {
        if (methodData.qrCodePublicId) {
          await deleteFile(methodData.qrCodePublicId || "");
        }

        const file = files[qrCodeFields[transactionMethodsKey]][0];
        const { url, imgId } = await uploadImage(
          file,
          false,
          `events/${eventSlug}/qr-codes`,
        );

        transactionMethods[transactionMethodsKey] = {
          number: methodData.number,
          qrCodeUrl: url,
          qrCodePublicId: imgId,
        };
      } else if (methodData && methodData.number) {
        transactionMethods[transactionMethodsKey] = {
          number: methodData.number,
          ...(methodData.qrCodeUrl && methodData.qrCodePublicId
            ? {
                qrCodeUrl: isEdit
                  ? urlChanger(oldSlug!, eventSlug, methodData.qrCodeUrl)
                  : methodData.qrCodeUrl,
                qrCodePublicId: methodData.qrCodePublicId,
              }
            : {}),
        };
      } else {
        if (isEdit && methodData?.qrCodePublicId) {
          await deleteFile(methodData.qrCodePublicId || "");
        }
      }
    }

    formData.transactionMethods = transactionMethods;
  }

  eventData.formData = formData;

  const sections: string[] = eventData.sections;

  // 1. Hero
  if (sections.includes("hero") && body.heroData) {
    eventData.heroData = body.heroData;
  }

  // 2. Video
  if (sections.includes("video")) {
    if (files.videoData?.length > 0) {
      if (isEdit && body.videoData?.videoPublicId) {
        await deleteFile(body.videoData.videoPublicId);
      }
      const { url, videoId } = await uploadVideo(
        files.videoData[0],
        `events/${eventSlug}/videos`,
      );
      eventData.videoData = { url, videoPublicId: videoId, hasAudio: false };
    } else if (isEdit && body.videoData) {
      eventData.videoData = {
        url: urlChanger(oldSlug!, eventSlug, body.videoData.url),
        videoPublicId: body.videoData.videoPublicId,
        hasAudio: false,
      };
    }
  }

  // 3. About
  if (sections.includes("about") && body.aboutData) {
    const aboutData = { ...body.aboutData };
    if (files.aboutImage?.length > 0) {
      if (aboutData.aboutImagePublicId)
        await deleteFile(aboutData.aboutImagePublicId);
      const { url, imgId } = await uploadImage(
        files.aboutImage[0],
        false,
        `events/${eventSlug}/about`,
      );
      aboutData.aboutImageUrl = url;
      aboutData.aboutImagePublicId = imgId;
    } else if (isEdit && aboutData.aboutImageUrl) {
      aboutData.aboutImageUrl = urlChanger(
        oldSlug!,
        eventSlug,
        aboutData.aboutImageUrl,
      );
    }
    eventData.aboutData = aboutData;
  }

  // 4. Segments (Combines both add/edit configurations safely)
  if (sections.includes("segments") && body.segmentsData) {
    const segmentData: SegmentType[] = [];
    const qrCodeImages: Express.Multer.File[] =
      files["segmentTMethodQrs"] || [];

    for (const segment of body.segmentsData) {
      const segmentDataItem: SegmentType = {
        segmentSlug: segment.segmentSlug,
        locationType: segment.locationType,
        teamType: segment.teamType,
        icon: segment.icon,
        title: segment.title,
        summary: segment.summary,
        details: segment.details,
        rules: segment.rules,
        maxTeamSize: segment.maxTeamSize,
        isPaidSegment: segment.isPaidSegment || false,
        fees:
          typeof segment.fees === "string"
            ? parseFloat(segment.fees)
            : segment.fees || 0,
      };

      if (!segment.transactionMethods) {
        segmentData.push(segmentDataItem);
        continue;
      }

      const platforms = segment.transactionPlatforms || [];
      segmentDataItem.transactionMethods = {};
      const methods = Object.keys(segment.transactionMethods);

      for (const method of methods) {
        const methodData = segment.transactionMethods[method];
        if (!methodData.number) continue;

        // Skip platforms that are no longer supported or active
        if (isEdit && !platforms.includes(method)) {
          if (methodData.qrCodePublicId)
            await deleteFile(methodData.qrCodePublicId);
          continue;
        }

        const transactionMethod: {
          number: string;
          qrCodeUrl?: string;
          qrCodePublicId?: string;
        } = { number: methodData.number };

        if (methodData.code) {
          if (methodData.qrCodePublicId)
            await deleteFile(methodData.qrCodePublicId);
          const qrFile = qrCodeImages.find(
            (file) => file.originalname.split(".")[0] === methodData.code,
          );
          if (qrFile) {
            const { url, imgId } = await uploadImage(
              qrFile,
              false,
              `events/${eventSlug}/transaction-methods`,
            );
            transactionMethod.qrCodeUrl = url;
            transactionMethod.qrCodePublicId = imgId;
          }
        } else if (methodData.qrCodeUrl) {
          transactionMethod.qrCodeUrl = isEdit
            ? urlChanger(oldSlug!, eventSlug, methodData.qrCodeUrl)
            : methodData.qrCodeUrl;
          transactionMethod.qrCodePublicId = methodData.qrCodePublicId;
        }

        segmentDataItem.transactionMethods[method] = transactionMethod;
      }

      if (Object.keys(segmentDataItem.transactionMethods).length === 0) {
        delete segmentDataItem.transactionMethods;
      }
      segmentData.push(segmentDataItem);
    }
    eventData.segmentsData = segmentData;
  }

  // 5. Experiences & Schedules
  if (sections.includes("experiences") && body.experiencesData)
    eventData.experiencesData = body.experiencesData;
  if (sections.includes("schedule") && body.scheduleData)
    eventData.scheduleData = body.scheduleData;

  // 6. Sponsors & Partners
  if (sections.includes("sp") && body.spData) {
    const spData: SpType[] = [];
    if (files.spLogos?.length > 0) {
      const newSPLogos: { [key: string]: Express.Multer.File } = {};
      files.spLogos.forEach((file: Express.Multer.File) => {
        newSPLogos[file.originalname] = file;
      });

      for (const sp of body.spData) {
        if (sp.logoPublicId && newSPLogos[sp.logoPublicId]) {
          await deleteFile(sp.logoPublicId);

          const { url, imgId } = await uploadImage(
            newSPLogos[sp.logoPublicId],
            false,
            `events/${eventSlug}/sponsors-partners`,
          );
          spData.push({
            name: sp.name,
            websiteUrl: sp.websiteUrl,
            logoUrl: url,
            logoPublicId: imgId,
          });
        } else {
          spData.push({
            name: sp.name,
            websiteUrl: sp.websiteUrl,
            logoUrl: isEdit
              ? urlChanger(oldSlug!, eventSlug, sp.logoUrl || "")
              : sp.logoUrl,
            logoPublicId: sp.logoPublicId,
          });
        }
      }
    } else {
      body.spData.forEach((sp: any) => {
        spData.push({
          name: sp.name,
          websiteUrl: sp.websiteUrl,
          logoUrl: isEdit
            ? urlChanger(oldSlug!, eventSlug, sp.logoUrl || "")
            : sp.logoUrl,
          logoPublicId: sp.logoPublicId,
        });
      });
    }

    eventData.spData = spData;
  }

  // 7. FAQs
  if (sections.includes("faqs") && body.faqData)
    eventData.faqData = body.faqData;

  return eventData;
}
