import { api } from "@/config/axios";
import type { ContactSchemaType } from "../validation/contactSchema";

export async function getAllMessages(
  page: number,
  limit: number,
  search: string
) {
  return api.get(`/message/get-message`, {
    params: {
      page: page,
      limit: limit,
      name: search,
    },
  });
}

export async function sendMessage(data: ContactSchemaType) {
  return api.post("/message/send-message", data);
}

export async function markMessageAsRead(messageId: string) {
  return api.patch("/message/mark-message-as-read", {
    id: messageId,
  });
}

export async function deleteMessage(messageId: string) {
  return api.delete("/message/delete-message", {
    params: { id: messageId },
  });
}
