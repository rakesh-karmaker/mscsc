import { api } from "@/config/axios";
import type { EventFormDataType } from "@/types/event-types";

export async function addEvent(data: EventFormDataType) {
  const formData = new FormData();
  for (const key in data) {
    if (
      key === "eventLogo" ||
      key === "eventFavicon" ||
      key === "bkashQrCode" ||
      key === "nagadQrCode" ||
      key === "rocketQrCode" ||
      key === "videoData" ||
      key === "aboutImage"
    ) {
      const file = data[key as keyof typeof data] as File;
      if (file) {
        formData.append(key, file);
      }
    } else if (key === "spLogos") {
      const files = data[key as keyof typeof data] as File[];
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append(`spLogos`, file);
        });
      }
    } else {
      formData.append(key, JSON.stringify(data[key as keyof typeof data]));
    }
  }

  return api.post("/event/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
