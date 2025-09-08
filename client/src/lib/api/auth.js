import { api } from "@/config/axios";

export async function verifyToken() {
  try {
    const response = await api.get("/member");
    return response;
  } catch (err) {
    console.log("Error verifying token:");
    return null;
  }
}

export async function registerUser(data) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "consent") {
      continue;
    }
    if (key === "image") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key]);
  }
  return api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function loginUser(data) {
  return api.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function editUser(data) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "image") {
      if (data[key].length === 0) {
        continue;
      }
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(
      key,
      key === "timeline" ? JSON.stringify(data[key]) : data[key]
    );
  }
  return api.put("/member", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
