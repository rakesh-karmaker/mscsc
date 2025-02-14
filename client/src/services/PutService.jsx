import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add a request interceptor to dynamically set the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const editUser = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      if (data[key].length === 0) {
        continue;
      }
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(
      key,
      key === "timeline" ? JSON.stringify(data[key]) : data[key]
    );
  }
  return api.put("/member", formData);
};

const editMessage = (data) => {
  return api.put("/message", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const editActivity = (data) => {
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
  return api.put("/activity", formData);
};

const editSubmission = (data) => {
  const formData = new FormData();
  formData.append("slug", data.slug);
  formData.append("username", data.username);
  formData.append("answer", data.answer);
  if (data?.poster) {
    formData.append("poster", data.poster);
  }
  return api.put("/task/edit-submission", formData);
};

export { editUser, editMessage, editActivity, editSubmission };
