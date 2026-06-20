import { api } from "@/config/axios";
import type { EditUserSchemaType } from "../validation/edit-user-schema";
import type { TimelineSchemaType } from "../validation/timeline-schema";
import type {
  MemberEditTypes,
  MembersParams,
  MembersSearchParams,
} from "@/types/member-types";

export async function getMember(slug: string) {
  const response = await api.get(`/members/${slug}`);
  return response.data;
}

export async function getMembers(params: MembersSearchParams) {
  return api.get(`/members/all-table`, {
    params,
  });
}

export async function getAllMembers(limit: number, params: MembersParams) {
  const { search, ...rest } = params;
  return api.get(`/members/all`, {
    params: {
      limit: limit,
      name: params.search,
      ...rest,
    },
  });
}

export async function editUser(
  data: EditUserSchemaType & {
    slug: string;
    new: boolean;
  },
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

  return api.patch("/members/edit-member", formData, {
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

  return api.patch(`/members/edit-member`, formData);
}

export async function editMember(
  data: MemberEditTypes | { slug: string; new: boolean },
  isRoleOrPositionChange = false,
) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, String(data[key as keyof typeof data]));
  }
  return api.patch(
    `/members${isRoleOrPositionChange ? "/admin" : ""}/edit-member`,
    formData,
    {
      headers: isRoleOrPositionChange
        ? {}
        : {
            "Content-Type": "multipart/form-data",
          },
    },
  );
}

export async function deleteMember(data: { slug: string }) {
  return api.delete(`/members/${data.slug}`);
}
