import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const loginUser = (date) => {
  const formData = new FormData();
  for (const key in date) {
    formData.append(key, date[key]);
  }
  return api.post("/auth/login", formData);
};

export { loginUser };
