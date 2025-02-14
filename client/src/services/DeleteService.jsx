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

const deleteTask = (slug) => {
  return api.delete("/task/delete-task", { data: { slug: slug } });
};

const deleteSubmission = (slug, username) => {
  return api.delete("/task/delete-submission", {
    data: { slug: slug, username: username },
  });
};

const deleteChampion = (slug, username) => {
  return api.delete("/task/delete-champion", {
    data: { slug: slug, username: username },
  });
};

export {
  deleteMember,
  deleteMessage,
  deleteActivity,
  deleteTask,
  deleteSubmission,
  deleteChampion,
};
