import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

const verifyToken = async (token) => {
  api.interceptors.request.use(function (config) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });
  try {
    const response = await api.get("/user");
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

const getUserById = (id) => {
  return api.get(`/user/${id}`);
};

export { verifyToken, getUserById };
