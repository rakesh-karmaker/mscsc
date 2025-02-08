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

const verifyToken = async () => {
  try {
    const response = await api.get("/member");
    return response;
  } catch (err) {
    console.log("Error verifying token:");
    return null;
  }
};

const getUser = async (slug) => {
  const response = await api.get(`/member/${slug}`);
  return response.data;
};

const getAllActivities = (page, limit, tag, search) => {
  return api.get(
    `/activity?limit=${limit}&page=${page}&tag=${tag}&title=${search}`
  );
};

const getAllMembers = (page, limit, search, role, branch) => {
  return api.get(
    `/member/all?page=${page}&limit=${limit}&name=${search}&role=${role}&branch=${branch}`
  );
};

const getActivity = (slug) => {
  return api.get(`/activity/${slug}`);
};

const getAllMessages = (page, limit, search) => {
  return api.get(`/message?page=${page}&limit=${limit}&name=${search}`);
};

export {
  verifyToken,
  getUser,
  getAllMembers,
  getAllMessages,
  getAllActivities,
  getActivity,
};
