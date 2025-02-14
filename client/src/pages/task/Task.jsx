import Loader from "@/components/UI/Loader/Loader";
import { useUser } from "@/contexts/UserContext";
import { getTask } from "@/services/GetService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskSidebar } from "@/layouts/tasksSidebar/TasksSidebar";
import toast from "react-hot-toast";

import "./Task.css";
import { useForm } from "react-hook-form";
import Submission from "@/components/tasksComponents/submission/Submission";
import { IoIosCreate } from "react-icons/io";
import dateFormat from "@/utils/dateFormat";
import TaskTags from "@/components/tasksComponents/taskTags/TaskTags";
import Preview from "@/components/tasksComponents/preview/Preview";
import { submitTask } from "@/services/PostService";
import { editSubmission } from "@/services/PutService";

const Task = ({ admin, ...rest }) => {
  const { user, isVerifying } = useUser();

  // redirect to unauthorized if user is not logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (!isVerifying && user === null) {
      navigate("/401", { replace: true });
    }
  }, [user, navigate, isVerifying]);

  const queryClient = useQueryClient();
  const { taskName } = useParams();
  const link = useLocation();
  const url = new URLSearchParams(link.search);
  const username = url.get("user") || (!admin ? user?.slug : null);

  const isOwner = user?.slug === username;
  const [editable, setEditable] = useState(false);
  const [mode, setMode] = useState(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["task", taskName, username],
    queryFn: () => getTask(taskName, username),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (isError && error) {
    throw Error("Task not found");
  }

  const task = data?.data;

  useEffect(() => {
    if (!(isVerifying || isLoading)) {
      if (
        username &&
        !task?.submissions?.map((s) => s.username).includes(username) &&
        !isOwner
      ) {
        throw Error("Submission not found");
      }

      // check if the user has already submitted so that they can edit
      if (
        user?.submissions
          ?.map((s) => s.taskId)
          .includes(task?._id.toString()) &&
        isOwner &&
        new Date(task?.deadline) > new Date() &&
        !admin
      ) {
        setEditable(true);
        setMode("edit");
      } else if (isOwner && new Date(task?.deadline) > new Date() && !admin) {
        setMode("edit");
      } else {
        setEditable(false);
        setMode(admin && !username ? "edit" : "preview");
      }
    }
  }, [isVerifying, isLoading, username]);

  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: task?.submissions?.find((s) => s.username === username)?.answer,
    },
  });

  const taskMutation = useMutation({
    mutationFn: (data) => {
      if (editable) {
        return editSubmission(data);
      } else {
        return submitTask(data);
      }
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries(["task"]);
      toast.success(res?.data?.message);
      // reset the form
      reset();
      setMode("preview");
      setEditable(true);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (data) => {
    const answer = data?.content;
    const poster = data?.poster;
    const previousAnswer = task?.submissions?.find(
      (s) => s.username === username
    )?.answer;
    if (!answer && !previousAnswer) {
      toast.error("Nothing to submit");
    } else {
      taskMutation.mutate({
        slug: task?.slug,
        username,
        answer,
        poster: poster[0],
      });
    }
  };

  const handleSubmitClick = () => {
    formRef.current.requestSubmit();
  };

  return (
    <main className="page-task">
      {isLoading || isVerifying ? (
        <Loader />
      ) : (
        <>
          <div className="task-section">
            <div className="task-header">
              <h2 className="task-name">{task.name}</h2>
              <p className="created">
                <IoIosCreate /> <span>{dateFormat(task.createdAt)}</span>
              </p>
              {isOwner && editable && !admin && (
                <div className="mode-btns">
                  <button
                    className={`mode ${mode === "edit" ? "active" : ""}`}
                    onClick={() => setMode("edit")}
                  >
                    Edit Mode
                  </button>
                  <button
                    className={`mode ${mode === "preview" ? "active" : ""}`}
                    onClick={() => setMode("preview")}
                  >
                    Preview Mode
                  </button>
                </div>
              )}
            </div>

            {mode === "preview" ? (
              <Preview
                submission={task?.submissions?.find(
                  (s) => s.username === username
                )}
                champion={task?.champion}
              />
            ) : (
              <Submission
                task={task}
                username={username}
                formRef={formRef}
                onSubmit={onSubmit}
                register={register}
                handleSubmit={handleSubmit}
              />
            )}

            <div className="task-info">
              <TaskTags
                task={task}
                submissions={user?.submissions.map((s) => s.taskId.toString())}
                username={username}
                admin={admin}
              />
            </div>
          </div>

          <TaskSidebar
            task={task}
            onClick={handleSubmitClick}
            register={register}
            errors={errors}
            mode={mode}
            editable={editable}
            setEditable={setEditable}
            isSubmitting={taskMutation.isPending}
            username={username}
            admin={admin}
            {...rest}
          />
        </>
      )}
    </main>
  );
};

export default Task;
