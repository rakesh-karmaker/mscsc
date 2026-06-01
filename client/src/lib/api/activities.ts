import { api } from "@/config/axios";
import type { ActivitySchemaType } from "../validation/activity-schema";
import type { ActivitiesParams } from "@/types/activity-types";

export async function getAllActivities(
  limit: number,
  params: ActivitiesParams,
) {
  const { search, ...rest } = params;
  return api.get(`/activities`, {
    params: {
      limit: limit,
      title: search,
      ...rest,
    },
  });
}

export async function getActivity(slug: string, isEdit = false) {
  return api.get(`/activities/${slug}`, {
    params: { isEdit: isEdit },
  });
}

export async function getHomeActivities() {
  return api.get("/activities/get-home-activities");
}

export async function addActivity(data: ActivitySchemaType) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "activityImage") {
      formData.append(key, data[key][0]);
      continue;
    }
    if (key === "gallery") {
      if (!data?.gallery || data?.gallery.length === 0) {
        continue;
      }
      for (let i = 0; i < data[key].length; i++) {
        formData.append("gallery", data[key][i]);
      }
      continue;
    }
    formData.append(key, data[key as keyof typeof data]);
  }
  return api.post("/activities", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editActivity(
  data: ActivitySchemaType & { slug: string },
) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "activityImage") {
      if (!data?.activityImage || data?.activityImage.length === 0) {
        continue;
      }
      formData.append(key, data[key][0]);
      continue;
    }
    if (key === "gallery") {
      if (!data?.gallery || data?.gallery.length === 0) {
        continue;
      }
      for (let i = 0; i < data[key].length; i++) {
        formData.append("gallery", data[key][i]);
      }
      continue;
    }
    formData.append(key, data[key as keyof typeof data]);
  }
  return api.patch("/activities", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteActivity(slug: string) {
  return api.delete("/activities", { data: { slug: slug } });
}
