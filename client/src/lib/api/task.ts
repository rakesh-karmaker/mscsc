import { api } from "@/config/axios";
import type { TaskSchemaType } from "../validation/task-schema";
import type { TasksParams } from "@/types/task-types";

export async function getAllTasks(limit: number, params: TasksParams) {
  const { search, ...rest } = params;
  return api.get(`/tasks`, {
    params: {
      limit: limit,
      name: search,
      ...rest,
    },
  });
}

export async function getTask(slug: string, username: string | undefined) {
  return api.get(`/tasks/${slug}`, {
    params: {
      username: username,
    },
  });
}

export async function getTopSubmitters() {
  return api.get("/members/top-submitters");
}

export async function addTask(
  data: Omit<TaskSchemaType, "content" | "deadline" | "imageRequired"> & {
    instructions: string;
    deadline: string;
    imageRequired: string;
  },
) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key as keyof typeof data]);
  }

  return api.post("/tasks/create", formData);
}

export async function editTask(
  data: Omit<TaskSchemaType, "content" | "deadline" | "imageRequired"> & {
    instructions: string;
    deadline: string;
    imageRequired: string;
  } & { slug: string },
) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key as keyof typeof data]);
  }
  return api.patch("/tasks/edit-task", formData);
}

export async function deleteTask(slug: string) {
  return api.delete("/tasks/delete-task", { data: { slug: slug } });
}

export async function submitTask(data: {
  slug: string;
  username: string;
  answer: string;
  poster: File | string;
}) {
  const formData = new FormData();
  formData.append("slug", data.slug);
  formData.append("username", data.username);
  formData.append("answer", data.answer);
  formData.append("poster", data.poster);

  return api.post("/tasks/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editSubmission(data: {
  slug: string;
  username: string;
  answer: string;
  poster?: File | string;
}) {
  const formData = new FormData();
  formData.append("slug", data.slug);
  formData.append("username", data.username);
  formData.append("answer", data.answer);
  if (data?.poster) {
    formData.append("poster", data.poster);
  }
  return api.patch("/tasks/edit-submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteSubmission(slug: string, username: string) {
  return api.delete("/tasks/delete-submission", {
    data: { slug: slug, username: username },
  });
}

export async function makeWinner(
  position: string,
  slug: string,
  username: string,
) {
  return api.put("/tasks/make-winner", {
    slug: slug,
    username: username,
    position: position,
  });
}

export async function deleteWinner(slug: string, username: string) {
  return api.delete("/tasks/delete-winner", {
    data: { slug: slug, username: username },
  });
}
