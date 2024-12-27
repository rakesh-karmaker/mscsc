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
    const response = await api.get("/member");
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

const getUserById = (id) => {
  return api.get(`/member/${id}`);
};

const getAllMembers = () => {
  return api.get("/member/all");
};

export { verifyToken, getUserById, getAllMembers };
