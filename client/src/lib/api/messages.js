import { api } from "@/config/axios";

export async function getAllMessages(page, limit, search) {
  return api.get(`/message`, {
    params: {
      page: page,
      limit: limit,
      name: search,
    },
  });
}

export async function sendMessage(data) {
  return api.post("/message", data);
}

export async function editMessage(data) {
  return api.put("/message", data);
}

export async function deleteMessage(id) {
  return api.delete("/message", { data: id });
}
