import { api } from "@/config/axios";
import type { RegisterSchemaType } from "../validation/registerSchema";
import type { LoginSchemaType } from "../validation/loginSchema";

// Verify JWT Token and get user data
export async function verifyToken() {
  try {
    const response = await api.get("/auth/verify");
    return response;
  } catch (err) {
    console.log("Error verifying token:");
    return null;
  }
}

export async function registerUser(data: RegisterSchemaType) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "consent") {
      continue;
    }
    if (key === "image") {
      formData.append(key, data[key][0]);
      continue;
    }
    formData.append(key, data[key as keyof RegisterSchemaType] as string);
  }
  return api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function loginUser(data: LoginSchemaType) {
  return api.post("/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
