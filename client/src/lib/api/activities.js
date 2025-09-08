import { api } from "@/config/axios";

export async function getAllActivities(page, limit, tag, search) {
  return api.get(`/activity`, {
    params: {
      limit: limit,
      page: page,
      tag: tag,
      search: search,
    },
  });
}

export async function getActivity(slug) {
  return api.get(`/activity/${slug}`);
}

export async function getEvents() {
  return api.get("/activity/events");
}

export async function getArticles() {
  return api.get("/activity/articles");
}

export async function addActivity(data) {
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
    formData.append(key, data[key]);
  }
  return api.post("/activity", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editActivity(data) {
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
    formData.append(key, data[key]);
  }
  return api.put("/activity", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteActivity(slug) {
  return api.delete("/activity", { data: { slug: slug } });
}
