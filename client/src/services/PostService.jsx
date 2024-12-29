import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

const registerUser = (data) => {
  api.interceptors.request.use(function (config) {
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  });
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.post("/auth/register", formData);
};

const loginUser = (data) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return api.post("/auth/login", formData);
};

const sendMessage = (data) => {
  console.log("data", data);

  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return api.post("/message", formData);
};

export { registerUser, loginUser, sendMessage };
