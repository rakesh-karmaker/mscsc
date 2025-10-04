import { api } from "@/config/axios";

export async function getMember(slug: string) {
  const response = await api.get(`/member/${slug}`);
  return response.data;
}

export async function getAllMembers(
  page: number,
  limit: number,
  search: string,
  role: string,
  branch: string,
  position: string
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

// export async function editUser(data) {
//   const formData = new FormData();
//   for (const key in data) {
//     if (key === "image") {
//       if (data[key].length === 0) {
//         continue;
//       }
//       formData.append(key, data[key][0]);
//       continue;
//     }
//     formData.append(
//       key,
//       key === "timeline" ? JSON.stringify(data[key]) : data[key]
//     );
//   }

//   return api.patch("/member/edit-member", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

export async function deleteMember(data: { slug: string }) {
  return api.delete(`/member/${data.slug}`);
}
