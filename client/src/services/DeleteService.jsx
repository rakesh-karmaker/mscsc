import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const deleteMember = (id) => {
  return api.delete("/member", { data: id });
};

const deleteMessage = (id) => {
  return api.delete("/message", { data: id });
};

const deleteActivity = (_id) => {
  return api.delete("/activity", { data: { _id: _id } });
};

export { deleteMember, deleteMessage, deleteActivity };
