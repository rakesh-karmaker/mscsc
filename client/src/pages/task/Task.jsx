import { useUser } from "@/contexts/UserContext";
import { getTask } from "@/services/GetService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// import all the necessary components
import Loader from "@/components/UI/Loader/Loader";
import TaskHeader from "@/components/tasksComponents/taskHeader/TaskHeader";
import { TaskSidebar } from "@/layouts/tasksSidebar/TasksSidebar";
import Preview from "@/components/tasksComponents/preview/Preview";
import Submission from "@/components/tasksComponents/submission/Submission";
import TaskTags from "@/components/tasksComponents/taskTags/TaskTags";

// server request functions
import { submitTask } from "@/services/PostService";
import { editSubmission } from "@/services/PutService";

import "./Task.css";

const Task = ({ admin, ...rest }) => {
  const queryClient = useQueryClient();
  const { user, isVerifying } = useUser();

  // get the data from the url
  const link = useLocation();
  const url = new URLSearchParams(link.search);
  const username = url.get("user") || (!admin ? user?.slug : null);
  const { taskName } = useParams();

  // init all the necessary states
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModeChanger, setShowModeChange] = useState(true);
  const [mode, setMode] = useState("edit");

  // get the task
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["task", taskName, username],
    queryFn: () => getTask(taskName, username),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 0,
  });
  if (
    (isError && error) ||
    (user && username !== user.slug && user?.position === "member" && !admin)
  ) {
    throw Error("Task not found");
  }
  const task = data?.data;

  useEffect(() => {
    if (!(isVerifying || isLoading)) {
      // change the states to default as the parameter change of the url won't change the states
      setCanSubmit(false);
      setShowModeChange(true);
      setMode("edit");

      changeStates(
        user,
        task,
        username,
        setCanSubmit,
        setMode,
        setShowModeChange,
        admin
      );
    }
  }, [isVerifying, isLoading, username]);

  // init the form for the user to submit the task
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

  // send a submit request
  const taskMutation = useMutation({
    mutationFn: (data) => {
      if (task?.submissions?.find((s) => s.username === username)) {
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
      setShowModeChange(true);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  // filer the data and trigger a submit mutation
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

  // trigger the form submission
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
            <TaskHeader
              task={task}
              mode={mode}
              setMode={setMode}
              showModeChanger={showModeChanger}
            />

            {mode === "preview" ? (
              <Preview
                submission={task?.submissions?.find(
                  (s) => s.username === username
                )}
                task={task}
              />
            ) : (
              <Submission
                task={task}
                username={username}
                formRef={formRef}
                onSubmit={onSubmit}
                register={register}
                handleSubmit={handleSubmit}
                canSubmit={canSubmit}
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
            isSubmitting={taskMutation.isPending}
            username={username}
            admin={admin}
            canSubmit={canSubmit}
            setShowModeChange={setShowModeChange}
            {...rest}
          />
        </>
      )}
    </main>
  );
};

// change states according to all scenarios
const changeStates = (
  user,
  task,
  username,
  setCanSubmit,
  setMode,
  setShowModeChange,
  admin
) => {
  if (!task) {
    throw Error("Task not found");
  }

  const isOwner = user?.slug === username;

  // check if the submission exists
  if (
    username &&
    !task?.submissions?.map((s) => s.username).includes(username) &&
    !isOwner
  ) {
    throw Error("Submission not found");
  }

  // when admin is seeing the task page
  if (admin && !username) {
    setShowModeChange(false);
  }

  // when someone is viewing a submission
  else if (!isOwner || admin) {
    setMode("preview");
    setShowModeChange(false);
  }

  // if the owner views the task
  else if (!admin && username && isOwner) {
    // if the deadline is valid
    if (new Date(task?.deadline) > new Date()) {
      setCanSubmit(true);
    }
    // if the deadline is invalid
    else {
      setShowModeChange(false);
    }

    // check if the owner has already submitted
    const submission = task?.submissions?.find((s) => s.username === username);
    if (submission) {
      setMode("preview");
    } else {
      setShowModeChange(false);
      setMode("edit");
    }
  } else {
    setShowModeChange(false);
  }
};

export default Task;
