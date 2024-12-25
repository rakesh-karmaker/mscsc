import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

const verifyToken = async (token) => {
  console.log(import.meta.env.VITE_API_URL);
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

const loginUser = (date) => {
  const formData = new FormData();
  for (const key in date) {
    formData.append(key, date[key]);
  }
  return api.post("/auth/login", formData);
};

const getUserById = (id) => {
  return api.get(`/user/${id}`);
};

export { verifyToken, loginUser, getUserById };
