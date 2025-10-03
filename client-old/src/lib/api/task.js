import { api } from "@/config/axios";

export async function getAllTasks(page, limit, search, category) {
  return api.get(`/task`, {
    params: {
      page: page,
      limit: limit,
      name: search,
      category: category,
    },
  });
}

export async function getTask(slug, username) {
  return api.get(`/task/${slug}`, {
    params: {
      username: username,
    },
  });
}

export async function getTopSubmitters() {
  return api.get("/member/top-submitters");
}

export async function addTask(data) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  return api.post("/task/create", formData);
}

export async function editTask(data) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return api.patch("/task/edit-task", formData);
}

export async function deleteTask(slug) {
  return api.delete("/task/delete-task", { data: { slug: slug } });
}

export async function submitTask(data) {
  const formData = new FormData();
  formData.append("slug", data.slug);
  formData.append("username", data.username);
  formData.append("answer", data.answer);
  formData.append("poster", data.poster);

  return api.post("/task/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editSubmission(data) {
  const formData = new FormData();
  formData.append("slug", data.slug);
  formData.append("username", data.username);
  formData.append("answer", data.answer);
  if (data?.poster) {
    formData.append("poster", data.poster);
  }
  return api.patch("/task/edit-submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteSubmission(slug, username) {
  return api.delete("/task/delete-submission", {
    data: { slug: slug, username: username },
  });
}

export async function makeWinner(position, slug, username) {
  return api.put("/task/make-winner", {
    slug: slug,
    username: username,
    position: position,
  });
}

export async function deleteWinner(slug, username) {
  return api.delete("/task/delete-winner", {
    data: { slug: slug, username: username },
  });
}
