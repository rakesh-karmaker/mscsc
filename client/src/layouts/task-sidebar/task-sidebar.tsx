import TaskSidebarCard from "@/components/ui/task-sidebar-card";
import { deleteSubmission } from "@/lib/api/task";
import type { Task } from "@/types/task-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Counter from "@/components/ui/counter/counter";
import Submissions from "./task-submissions";
import AdminTaskActions from "./admin-task-actions";
import SubmitCard from "./submit-card";
import {
  requireMinimumRole,
  ROLES,
  type Role,
} from "@/utils/require-minimum-role";

import "../tasks-sidebar/tasks-sidebar.css";

type TaskSidebarProps = {
  task: Task;
  register: UseFormRegister<{ content: string; poster: FileList }>;
  onClick: () => void;
  errors: FieldErrors<{ content: string; poster: FileList }>;
  mode: "preview" | "edit";
  isSubmitting: boolean;
  username: string | null;
  isDashboard?: boolean;
  canSubmit: boolean;
  setShowModeChange: Dispatch<SetStateAction<boolean>>;
  role: Role;
};

export default function TaskSidebar({
  task,
  register,
  onClick,
  errors,
  mode,
  isSubmitting,
  username,
  isDashboard,
  canSubmit,
  setShowModeChange,
  role,
  ...rest
}: TaskSidebarProps): ReactNode {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submissionDelete = useMutation({
    mutationFn: (slug: string) => {
      if (!username) {
        toast.error("You need to be logged in to delete a submission");
        throw Error("Username is required");
      }
      return deleteSubmission(slug, username);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success(res?.data?.message);
      setShowModeChange(false);
      isDashboard && navigate("/admin/task/" + task?.slug);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "Deletion failed");
    },
  });

  const deleteFunc = (slug: string) => {
    submissionDelete.mutate(slug);
  };

  return (
    <aside className="task-sidebar">
      <TaskSidebarCard title={"Description"}>
        <p className="task-description">{task.summary}</p>
      </TaskSidebarCard>

      {mode === "edit" && canSubmit ? (
        <SubmitCard
          task={task}
          register={register}
          onClick={onClick}
          errors={errors}
          deleteFunc={deleteFunc}
          isSubmitting={isSubmitting}
          username={username || ""}
        />
      ) : null}

      {mode === "edit" && !isDashboard && !username && (
        <TaskSidebarCard title={"Login to submit"}>
          <p>
            You need to login to your account to be able to submit the task.
          </p>
          <NavLink to="/auth/login" className="primary-button">
            Login
          </NavLink>
        </TaskSidebarCard>
      )}

      {isDashboard && requireMinimumRole(role, ROLES.EDITOR) && (
        <AdminTaskActions
          task={task}
          username={username || ""}
          deleteFunc={deleteFunc}
          queryClient={queryClient}
          role={role}
          {...rest}
        />
      )}

      <TaskSidebarCard title={"Time left"}>
        <Counter date={task.deadline} />
      </TaskSidebarCard>

      <Submissions task={task} isDashboard={isDashboard} />
    </aside>
  );
}
