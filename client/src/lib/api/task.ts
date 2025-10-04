import { api } from "@/config/axios";

export async function getAllTasks(
  page: number,
  limit: number,
  search: string,
  category: string
) {
  return api.get(`/task`, {
    params: {
      page: page,
      limit: limit,
      name: search,
      category: category,
    },
  });
}

export async function getTask(slug: string, username: string) {
  return api.get(`/task/${slug}`, {
    params: {
      username: username,
    },
  });
}

export async function getTopSubmitters() {
  return api.get("/member/top-submitters");
}

// export async function addTask(data) {
//   const formData = new FormData();
//   for (const key in data) {
//     formData.append(key, data[key]);
//   }

//   return api.post("/task/create", formData);
// }

// export async function editTask(data) {
//   const formData = new FormData();
//   for (const key in data) {
//     formData.append(key, data[key]);
//   }
//   return api.patch("/task/edit-task", formData);
// }

// export async function deleteTask(slug: string) {
//   return api.delete("/task/delete-task", { data: { slug: slug } });
// }

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

  return api.post("/task/submit", formData, {
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
  return api.patch("/task/edit-submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteSubmission(slug: string, username: string) {
  return api.delete("/task/delete-submission", {
    data: { slug: slug, username: username },
  });
}

export async function makeWinner(
  position: string,
  slug: string,
  username: string
) {
  return api.put("/task/make-winner", {
    slug: slug,
    username: username,
    position: position,
  });
}

export async function deleteWinner(slug: string, username: string) {
  return api.delete("/task/delete-winner", {
    data: { slug: slug, username: username },
  });
}
