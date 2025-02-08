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

const deleteMember = (slug) => {
  return api.delete("/member", { data: slug });
};

const deleteMessage = (id) => {
  return api.delete("/message", { data: id });
};

const deleteActivity = (slug) => {
  return api.delete("/activity", { data: { slug: slug } });
};

export { deleteMember, deleteMessage, deleteActivity };
