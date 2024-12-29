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

export { editUser, editMessage };
