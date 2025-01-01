import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const editUser = (data) => {
  console.log("data", data);
  const formData = new FormData();
  for (const key in data) {
    formData.append(
      key,
      key === "timeline" ? JSON.stringify(data[key]) : data[key]
    );
  }
  console.log("data", formData);
  return api.put("/member", formData);
};

const editMessage = (data) => {
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
    if (key === "activityImage" && data[key][0] !== undefined) {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.put("/activity", formData);
};

export { editUser, editMessage, editActivity };
