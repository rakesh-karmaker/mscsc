import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const verifyToken = async (token) => {
  // Set the AUTH token for any request
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

export { verifyToken, loginUser };
