import { DeleteWarning } from "@/components/UI/DeleteWarning";
import { TaskSidebarCard } from "../TasksSidebar";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteTask, deleteWinner, makeWinner } from "@/lib/api/task";
import { useState } from "react";

const AdminTaskActions = ({
  task,
  username,
  deleteFunc,
  queryClient,
  ...rest
}) => {
  const navigate = useNavigate();
  const taskMutation = useMutation({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "add-position") {
        return makeWinner(rest.position, rest.slug, rest.username);
      } else if (method == "delete-position") {
        return deleteWinner(rest.slug, rest.username);
      } else if (method == "delete") {
        return deleteTask(rest.slug);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["task"]);
      toast.success(res?.data?.message);
      res?.data?.method === "DELETE" && navigate("/admin/tasks");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
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
};

// task actions to edit the task and delete the task
const TaskActions = ({ task, taskMutation, ...rest }) => {
  const [open, setOpen] = useState(false);

  const onDelete = (slug) => {
    taskMutation.mutate({ method: "delete", slug });
    setOpen(false);
  };
  return (
    <>
      <TaskSidebarCard title={"Task Actions"}>
        <p>
          To edit the task, click on the edit button and click the delete button
          to delete the task
        </p>
        <div className="task-actions">
          <button
            className="primary-button"
            onClick={() => rest?.setSelectedTask(task)}
          >
            Edit Task
          </button>

          <button
            className="danger-button primary-button"
            aria-label="Delete this data"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete Task
          </button>
        </div>
      </TaskSidebarCard>

      <DeleteWarning
        slug={task.slug}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Task"
      >
        This will permanently delete this task{" "}
        <span className="font-semibold">{task.name}</span> from the task list
        and remove all of its data from the server. All of its images, links,
        and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
};

// submission actions to give the submission a position and delete the submission
const SubmissionActions = ({ task, username, deleteFunc, taskMutation }) => {
  const [open, setOpen] = useState(false);

  const setPosition = (position, slug, username) => {
    taskMutation.mutate({ method: "add-position", slug, username, position });
  };

  const deletePosition = (slug, username) => {
    taskMutation.mutate({ method: "delete-position", slug, username });
  };

  const positionActions = [
    {
      key: "first",
      text: "1st",
    },
    {
      key: "second",
      text: "2nd",
    },
    {
      key: "third",
      text: "3rd",
    },
  ];

  return (
    <>
      <TaskSidebarCard title={"Submission Actions"}>
        <p>
          Click on the position buttons to give the submitter a position and
          click on the delete button to delete the submission
        </p>
        <div className="task-actions">
          {positionActions.map((position) => {
            return (
              <button
                key={position.key + task.slug + username}
                className={
                  "primary-button" +
                  (task[position.key] === username ? " danger" : "") +
                  (taskMutation.isPending ? " disabled" : "")
                }
                onClick={() =>
                  task[position.key] === username
                    ? deletePosition(task?.slug, username)
                    : setPosition(position.key, task?.slug, username)
                }
              >
                {position.text}
              </button>
            );
          })}

          <button
            className="danger-button primary-button"
            aria-label="Delete this data"
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </TaskSidebarCard>

      <DeleteWarning
        slug={task.slug}
        deleteFunc={(slug) => {
          deleteFunc(slug);
          setOpen(false);
        }}
        open={open}
        setOpen={setOpen}
        title="Delete Submission"
      >
        This will permanently delete this submission of{" "}
        <span className="font-semibold">{task.name}</span> from the submission's
        list and remove all of its data from the server. All of its images,
        links, and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
};

export default AdminTaskActions;
