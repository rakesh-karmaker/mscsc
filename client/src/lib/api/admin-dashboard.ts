import { api } from "@/config/axios";

export async function getAdminData() {
  return api.get("/admin/data");
}
