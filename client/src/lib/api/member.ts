import { api } from "@/config/axios";
import type { EditUserSchemaType } from "../validation/editUserSchema";
import type { TimelineSchemaType } from "../validation/timelineSchema";
import type { MemberEditTypes } from "@/types/memberTypes";

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

export async function editUser(
  data: EditUserSchemaType & {
    slug: string;
    new: boolean;
  }
) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      if (data[key].length === 0 || !data[key][0]) {
        continue;
      }
      // Ensure the file is a File or Blob before appending
      const file = data[key][0];
      if (file instanceof Blob) {
        formData.append(key, file);
      }
      continue;
    }

    if (key === "hideImage") {
      formData.append("isImageHidden", String(data[key]));
      continue;
    }

    formData.append(key, data[key as keyof EditUserSchemaType] as string);
  }

  return api.patch("/member/edit-member", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editTimeline(data: {
  timeline: TimelineSchemaType[];
  slug: string;
}) {
  const formData = new FormData();
  formData.append("timeline", JSON.stringify(data.timeline));
  formData.append("slug", data.slug);

  return api.patch(`/member/edit-member`, formData);
}

export async function editMember(
  data: MemberEditTypes | { slug: string; new: boolean }
) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, String(data[key as keyof typeof data]));
  }

  return api.patch("/member/edit-member", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteMember(data: { slug: string }) {
  return api.delete(`/member/${data.slug}`);
}
