import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
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

const registerUser = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const loginUser = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return api.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const sendMessage = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return api.post("/message", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const addActivity = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "activityImage") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.post("/activity", formData);
};

export { registerUser, loginUser, sendMessage, addActivity };
