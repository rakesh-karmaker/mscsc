import { api } from "@/config/axios";

export async function getAllMessages(page, limit, search) {
  return api.get(`/message/get-message`, {
    params: {
      page: page,
      limit: limit,
      name: search,
    },
  });
}

export async function sendMessage(data) {
  return api.post("/message/send-message", data);
}

export async function markMessageAsRead(messageId) {
  return api.patch("/message/mark-message-as-read", {
    params: { id: messageId },
  });
}

export async function deleteMessage(messageId) {
  return api.delete("/message/delete-message", {
    params: { id: messageId },
  });
}
