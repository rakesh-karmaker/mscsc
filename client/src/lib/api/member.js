import { api } from "@/config/axios";

export async function getMember(slug) {
  const response = await api.get(`/member/${slug}`);
  return response.data;
}

export async function getAllMembers(
  page,
  limit,
  search,
  role,
  branch,
  position
) {
  return api.get(`/member/all`, {
    params: {
      page: page,
      limit: limit,
      name: search,
      role: role,
      branch: branch,
      position: position,
    },
  });
}

export async function deleteMember(slug) {
  return api.delete(`/member/${slug}`);
}
