import { useUser } from "@/contexts/user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { editSubmission, getTask, submitTask } from "@/lib/api/task";
import type { Submission, Task, Task as TaskType } from "@/types/task-types";
import type { AxiosError } from "axios";
import Loader from "@/components/ui/loader/loader";
import TaskHeader from "@/components/task/task-header";
import TaskTags from "@/components/ui/task-tags/task-tags";
import type { User } from "@/types/user-types";
import TaskSubmissionPreview from "@/components/task/task-submission-preview/task-submission-preview";
import TaskSubmissionForm from "@/components/task/task-submission-form";
import TaskSidebar from "@/layouts/task-sidebar/task-sidebar";
import { Helmet } from "react-helmet-async";
import { ROLES } from "@/utils/require-minimum-role";

import "./task.css";

export default function Task({
  isDashboard = false,
  ...rest
}: {
  isDashboard?: boolean;
  setSelectedTask?: Dispatch<SetStateAction<TaskType | null>>;
}) {
  const queryClient = useQueryClient();
  const { user, isVerifying } = useUser();

  // get the data from the url
  const link = useLocation();
  const url = new URLSearchParams(link.search);
  const username = url.get("user") || (!isDashboard ? user?.slug : undefined);
  const { taskName } = useParams();

  // init all the necessary states
  const [canSubmit, setCanSubmit] = useState(false);
  const [showModeChanger, setShowModeChange] = useState(true);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  // get the task
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["task", taskName, username],
    queryFn: () => getTask(taskName || "", username),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 0,
  });
  if (isError && error) {
    throw Error("Task not found");
  }
  const task = data?.data as Task;

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
        isDashboard,
      );
    }
  }, [isVerifying, isLoading, username]);

  // init the form for the user to submit the task
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ content: string; poster: FileList }>({
    defaultValues: {
      content:
        task?.submissions?.find((s: Submission) => s.slug === username)
          ?.answer || "",
      poster: undefined as unknown as FileList, // or leave undefined if not required initially
    },
  });

  // send a submit request
  const taskMutation = useMutation({
    mutationFn: (data: {
      slug: string;
      username: string;
      answer: string;
      poster: File;
    }) => {
      if (task?.submissions?.find((s: Submission) => s.slug === username)) {
        return editSubmission(data);
      } else {
        return submitTask(data);
      }
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["task", taskName, username] });
      toast.success(res?.data?.message);
      // reset the form
      reset();
      setMode("preview");
      setShowModeChange(true);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "Submission failed");
    },
  });

  // filer the data and trigger a submit mutation
  const onSubmit = (data: { content: string; poster: FileList }) => {
    const answer = data?.content;
    const poster = data?.poster;
    const previousAnswer = task?.submissions?.find(
      (s: Submission) => s.slug === username,
    )?.answer;
    if (!answer && !previousAnswer) {
      toast.error("Nothing to submit");
    } else {
      taskMutation.mutate({
        slug: task?.slug,
        username: username || "",
        answer,
        poster: poster[0],
      });
    }
  };

  // trigger the form submission
  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - {task?.name || "Task"}</title>
        <meta property="og:title" content={`MSCSC - ${task?.name || "Task"}`} />
        <meta
          name="twitter:title"
          content={`MSCSC - ${task?.name || "Task"}`}
        />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/task/${task?.slug}`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/task/${task?.slug}`}
        />
      </Helmet>

      {/* page content */}
      <main className="page-task">
        {isLoading || isVerifying ? (
          <Loader />
        ) : (
          <div className="w-full flex gap-5 max-[1200px]:flex-col">
            <div className="task-section w-full">
              <TaskHeader
                task={task}
                mode={mode}
                setMode={setMode}
                showModeChanger={showModeChanger}
              />

              {mode === "preview" ? (
                <TaskSubmissionPreview
                  submission={task?.submissions?.find(
                    (s: Submission) => s.slug === username,
                  )}
                  task={task}
                />
              ) : (
                <TaskSubmissionForm
                  task={task}
                  username={username || ""}
                  formRef={formRef as RefObject<HTMLFormElement>}
                  onSubmit={onSubmit}
                  register={register}
                  handleSubmit={handleSubmit}
                  canSubmit={canSubmit}
                />
              )}

              <div className="task-info">
                <TaskTags
                  task={task}
                  userSubmissions={
                    user?.submissions.map((s) => s.taskId.toString()) || []
                  }
                  taskSubmissionCount={task?.submissions?.length || 0}
                  userId={
                    task?.submissions?.find(
                      (s: Submission) => s.slug === username,
                    )?.memberId
                  }
                  isDashboard={isDashboard}
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
              username={username || ""}
              isDashboard={isDashboard}
              canSubmit={canSubmit}
              setShowModeChange={setShowModeChange}
              role={user?.role || ROLES.MEMBER}
              {...rest}
            />
          </div>
        )}
      </main>
    </>
  );
}

// change states according to all scenarios
const changeStates = (
  user: User | null,
  task: TaskType,
  username: string | null | undefined,
  setCanSubmit: Dispatch<SetStateAction<boolean>>,
  setMode: Dispatch<SetStateAction<"edit" | "preview">>,
  setShowModeChange: Dispatch<SetStateAction<boolean>>,
  admin?: boolean,
) => {
  if (!task) {
    throw Error("Task not found");
  }

  const isOwner = user?.slug === username;

  // check if the submission exists
  if (
    username &&
    !task?.submissions?.map((s) => s.slug).includes(username) &&
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
    const submission = task?.submissions?.find((s) => s.slug === username);
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
