import { api } from "@/config/axios";

export async function getAllActivities(
  page: number,
  limit: number,
  tag: string,
  search: string
) {
  return api.get(`/activity`, {
    params: {
      limit: limit,
      page: page,
      tag: tag,
      title: search,
    },
  });
}

export async function getActivity(slug: string, isEdit = false) {
  return api.get(`/activity/${slug}`, {
    params: { isEdit: isEdit },
  });
}

export async function getHomeActivities() {
  return api.get("/activity/get-home-activities");
}

// export async function addActivity(data) {
//   const formData = new FormData();
//   for (const key in data) {
//     if (key === "activityImage") {
//       formData.append(key, data[key][0]);
//       continue;
//     }
//     if (key === "gallery") {
//       if (!data?.gallery || data?.gallery.length === 0) {
//         continue;
//       }
//       for (let i = 0; i < data[key].length; i++) {
//         formData.append("gallery", data[key][i]);
//       }
//       continue;
//     }
//     formData.append(key, data[key]);
//   }
//   return api.post("/activity", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

// export async function editActivity(data) {
//   const formData = new FormData();
//   for (const key in data) {
//     if (key === "activityImage") {
//       if (!data?.activityImage || data?.activityImage.length === 0) {
//         continue;
//       }
//       formData.append(key, data[key][0]);
//       continue;
//     }
//     if (key === "gallery") {
//       if (!data?.gallery || data?.gallery.length === 0) {
//         continue;
//       }
//       for (let i = 0; i < data[key].length; i++) {
//         formData.append("gallery", data[key][i]);
//       }
//       continue;
//     }
//     formData.append(key, data[key]);
//   }
//   return api.patch("/activity", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

export async function deleteActivity(slug: string) {
  return api.delete("/activity", { data: { slug: slug } });
}
