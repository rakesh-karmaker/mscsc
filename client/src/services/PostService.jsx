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
    if (key === "consent") {
      continue;
    }
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
  return api.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const forgotPasswordRequest = (email) => {
  return api.post("/reset-password/otp", email, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const sendMessage = (data) => {
  return api.post("/message", data, {
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
    if (key === "gallery") {
      for (let i = 0; i < data[key].length; i++) {
        formData.append("gallery", data[key][i]);
      }
      continue;
    }
    formData.append(key, data[key]);
  }
  console.log(formData);
  return api.post("/activity", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export {
  registerUser,
  loginUser,
  forgotPasswordRequest,
  sendMessage,
  addActivity,
};
