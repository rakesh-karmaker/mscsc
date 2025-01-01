import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

const verifyToken = async () => {
  const token = localStorage.getItem("token");
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

const getUserById = async (id) => {
  const response = await api.get(`/member/${id}`);
  return response.data;
};

const getAllActivities = (page, limit, tag, search) => {
  return api.get(
    `/activity?limit=${limit}&page=${page}&tag=${tag}&search=${search}`
  );
};

const getAllMembers = (page, limit, search, role) => {
  const token = localStorage.getItem("token");
  api.interceptors.request.use(function (config) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });
  return api.get(
    `/member/all?page=${page}&limit=${limit}&search=${search}&role=${role}`
  );
};

const getAllMessages = (page, limit, search) => {
  const token = localStorage.getItem("token");
  api.interceptors.request.use(function (config) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return api.get(`/message?page=${page}&limit=${limit}&search=${search}`);
};

export {
  verifyToken,
  getUserById,
  getAllMembers,
  getAllMessages,
  getAllActivities,
};
