import { uploadImage, deleteFile } from "../../../shared/lib/file-uploader.js";
import urlChanger from "../utils/url-changer.js";

export interface EventFileCollection {
  [fieldname: string]: Express.Multer.File[];
}

export async function processEventAssets(
  files: EventFileCollection,
  eventSlug: string,
  existingEvent?: any,
): Promise<{
  eventLogoUrl?: string;
  eventLogoPublicId?: string;
  eventFaviconUrl?: string;
  eventFaviconPublicId?: string;
  eventBannerUrl?: string;
  eventBannerPublicId?: string;
}> {
  const assets: {
    eventLogoUrl?: string;
    eventLogoPublicId?: string;
    eventFaviconUrl?: string;
    eventFaviconPublicId?: string;
    eventBannerUrl?: string;
    eventBannerPublicId?: string;
  } = {};

  // Setup initial placeholders if editing
  if (existingEvent) {
    assets.eventLogoUrl = urlChanger(
      existingEvent.eventSlug,
      eventSlug,
      existingEvent.eventLogoUrl,
    );
    assets.eventLogoPublicId = existingEvent.eventLogoPublicId;
    assets.eventFaviconUrl = urlChanger(
      existingEvent.eventSlug,
      eventSlug,
      existingEvent.eventFaviconUrl,
    );
    assets.eventFaviconPublicId = existingEvent.eventFaviconPublicId;
    assets.eventBannerUrl = urlChanger(
      existingEvent.eventSlug,
      eventSlug,
      existingEvent.eventBannerUrl,
    );
    assets.eventBannerPublicId = existingEvent.eventBannerPublicId;
  }

  // Process Logo
  if (files["eventLogo"]?.length > 0) {
    if (existingEvent?.eventLogoPublicId)
      await deleteFile(existingEvent.eventLogoPublicId);
    const { url, imgId } = await uploadImage(
      files["eventLogo"][0],
      false,
      `events/${eventSlug}/logo`,
    );
    assets.eventLogoUrl = url;
    assets.eventLogoPublicId = imgId;
  }

  // Process Favicon
  if (files["eventFavicon"]?.length > 0) {
    if (existingEvent?.eventFaviconPublicId)
      await deleteFile(existingEvent.eventFaviconPublicId);
    const { url, imgId } = await uploadImage(
      files["eventFavicon"][0],
      false,
      `events/${eventSlug}/logo`,
    );
    assets.eventFaviconUrl = url;
    assets.eventFaviconPublicId = imgId;
  }

  // Process Banner
  if (files["eventBanner"]?.length > 0) {
    if (existingEvent?.eventBannerPublicId)
      await deleteFile(existingEvent.eventBannerPublicId);
    const { url, imgId } = await uploadImage(
      files["eventBanner"][0],
      false,
      `events/${eventSlug}`,
    );
    assets.eventBannerUrl = url;
    assets.eventBannerPublicId = imgId;
  }

  return assets;
}
