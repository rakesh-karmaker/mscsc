import { api } from "@/config/axios";
import type { ContactSchemaType } from "../validation/contact-schema";
import type { MessagesSearchParams } from "@/types/message-types";

export async function getMessages(params?: MessagesSearchParams) {
  return api.get(`/message/get-message`, {
    params,
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
