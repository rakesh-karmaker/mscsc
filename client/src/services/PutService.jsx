import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
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
    formData.append(
      key,
      key === "timeline" ? JSON.stringify(data[key]) : data[key]
    );
  }
  return api.put("/member", formData);
};

const editMessage = (data) => {
  api.interceptors.request.use(function (config) {
    config.headers["Content-Type"] = "application/json";
    return config;
  });
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  console.log("data", formData);
  return api.put("/message", formData);
};

const editActivity = (data) => {
  api.interceptors.request.use(function (config) {
    config.headers["Content-Type"] = "multipart/form-data";
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  });

  const formData = new FormData();
  for (const key in data) {
    if (key === "activityImage") {
      if (data[key].length === 0) {
        continue;
      }
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.put("/activity", formData);
};

export { editUser, editMessage, editActivity };
