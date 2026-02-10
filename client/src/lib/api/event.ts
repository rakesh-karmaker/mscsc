import { api } from "@/config/axios";
import type { EventFormDataType } from "@/types/event-types";

export async function addEvent(data: EventFormDataType) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, JSON.stringify(data[key as keyof typeof data]));
  }

  return api.post("/event/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
