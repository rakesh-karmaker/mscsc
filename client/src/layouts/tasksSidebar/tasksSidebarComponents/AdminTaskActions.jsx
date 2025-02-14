import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { TaskSidebarCard } from "../TasksSidebar";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteChampion, deleteTask } from "@/services/DeleteService";
import { makeChampion } from "@/services/PutService";
import { useNavigate } from "react-router-dom";

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
      if (method == "make-champion") {
        return makeChampion(rest.slug, username);
      } else if (method == "delete-champion") {
        return deleteChampion(rest.slug, username);
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

const TaskActions = ({ task, taskMutation, ...rest }) => {
  const deleteTask = (slug) => {
    taskMutation.mutate({ method: "delete", slug });
  };
  return (
    <TaskSidebarCard title={"Task Actions"}>
      <p>change task</p>
      <div className="task-actions">
        <button
          className="primary-button"
          onClick={() => rest?.setSelectedTask(task)}
        >
          Edit Task
        </button>
        <DeleteBtn
          id={task.slug}
          deleteFunc={deleteTask}
          btnText="Delete"
          slug={task.slug}
          title="Delete Task"
        >
          Are you sure you want to delete {task.name}?
        </DeleteBtn>
      </div>
    </TaskSidebarCard>
  );
};

const SubmissionActions = ({ task, username, deleteFunc, taskMutation }) => {
  const makeChampionFunc = (slug) => {
    taskMutation.mutate({ method: "make-champion", slug });
  };

  const deleteChampionFunc = (slug) => {
    taskMutation.mutate({ method: "delete-champion", slug });
  };
  return (
    <TaskSidebarCard title={"Submission Actions"}>
      <p>make champion</p>
      <div className="task-actions">
        {username && task?.champion === username ? (
          <button
            className="primary-button"
            onClick={() => deleteChampionFunc(task.slug)}
          >
            {taskMutation.isPending ? "Deleting..." : "Delete Champion"}
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={() => makeChampionFunc(task.slug)}
          >
            Make Champion
          </button>
        )}
        <DeleteBtn
          id={task.slug}
          deleteFunc={deleteFunc}
          btnText="Delete"
          slug={task.slug}
          title="Delete Submission"
        >
          Are you sure you want to delete your submission of {task.name}?
        </DeleteBtn>
      </div>
    </TaskSidebarCard>
  );
};

export default AdminTaskActions;
