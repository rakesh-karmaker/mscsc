import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { "Content-Type": "multipart/form-data" },
});

const registerUser = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.post("/auth/register", formData);
};

export { registerUser };
