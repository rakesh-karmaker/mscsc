import { QueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteTask, deleteWinner, makeWinner } from "@/lib/api/task";
import { type ReactNode } from "react";
import type { Task } from "@/types/task-types";
import type { AxiosError, AxiosResponse } from "axios";
import TaskActions from "./task-actions";
import SubmissionActions from "./submission-actions";

type AdminTaskActionsProps = {
  task: Task;
  username: string;
  deleteFunc: (slug: string) => void;
  queryClient: QueryClient;
};

export default function AdminTaskActions({
  task,
  username,
  deleteFunc,
  queryClient,
  ...rest
}: AdminTaskActionsProps): ReactNode {
  const navigate = useNavigate();
  const taskMutation = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { method: string; slug: string; username: string; position?: string }
  >({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "add-position") {
        if (!rest.position || !rest.slug || !rest.username) {
          throw new Error("Missing required fields for makeWinner");
        }
        return makeWinner(rest.position, rest.slug, rest.username);
      } else if (method == "delete-position") {
        if (!rest.slug || !rest.username) {
          throw new Error("Missing required fields for deleteWinner");
        }
        return deleteWinner(rest.slug, rest.username);
      } else if (method == "delete") {
        if (!rest.slug) {
          throw new Error("Missing required field 'slug' for deleteTask");
        }
        return deleteTask(rest.slug);
      } else {
        return Promise.reject(new Error("Unknown mutation method"));
      }
    },
    onSuccess: (res: AxiosResponse) => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success(res?.data?.message);
      res?.data?.method === "DELETE" && navigate("/admin/tasks");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "Action failed");
    },
  });

  return username ? (
    <SubmissionActions
      task={task}
      username={username}
      taskMutation={taskMutation}
      deleteFunc={deleteFunc}
    />
  ) : (
    <TaskActions task={task} taskMutation={taskMutation} {...rest} />
  );
}
