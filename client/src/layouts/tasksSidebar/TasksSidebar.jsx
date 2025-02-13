import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getTopSubmitters } from "@/services/GetService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import Loader from "@/components/UI/Loader/Loader";
import { useUser } from "@/contexts/UserContext";
import { useTask } from "@/contexts/TasksContext";
import { useRef, useEffect, useState } from "react";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import dayAgo from "@/utils/dayAgo";
import Counter from "@/components/UI/Counter/Counter";

import "./TasksSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { deleteSubmission } from "@/services/DeleteService";
import toast from "react-hot-toast";

const TasksSidebar = () => {
  const { category: currentCategory, setCategory, response } = useTask();
  const { user } = useUser();
  const totalLengthRef = useRef(null);
  const [initialTotalLength, setInitialTotalLength] = useState(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topSubmitters"],
    queryFn: getTopSubmitters,
  });

  useErrorNavigator(isError, error);

  const categories = ["Article Writing", "Poster Design"];

  // Set the initial value of totalLengthRef
  useEffect(() => {
    if (
      totalLengthRef.current === null &&
      response?.totalLength !== undefined
    ) {
      totalLengthRef.current = response.totalLength;
      setInitialTotalLength(response.totalLength);
    }
  }, [response?.totalLength]);

  return (
    <aside className="tasks-sidebar">
      <TaskSidebarCard title={"Category"}>
        {categories.map((category) => {
          return (
            <p
              key={category}
              className={
                "task-category" +
                (category === currentCategory ? " active" : "")
              }
              onClick={() => setCategory(category.toLowerCase())}
            >
              {category}
            </p>
          );
        })}
      </TaskSidebarCard>

      <TaskSidebarCard title={"Task Completed"}>
        <p className="task-number">
          <span>{user?.submissions.length}</span>
          <span>/</span>
          <span>{initialTotalLength}</span>
        </p>
      </TaskSidebarCard>

      <Submitters data={data} isLoading={isLoading} title={"Top Submitters"} />
    </aside>
  );
};

const TaskSidebar = ({
  task,
  register,
  onClick,
  errors,
  editable,
  setEditable,
  mode,
  isSubmitting,
  username,
  formRef,
}) => {
  const queryClient = useQueryClient();
  const taskDelete = useMutation({
    mutationFn: (slug) => {
      return deleteSubmission(slug, username);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["task"]);
      setEditable(false);
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const deleteFunc = (slug) => {
    taskDelete.mutate(slug);
  };
  return (
    <aside className="task-sidebar">
      <TaskSidebarCard title={"Description"}>
        <p className="task-description">{task.summary}</p>
      </TaskSidebarCard>

      {mode === "edit" ? (
        <TaskSidebarCard title={"Submit"}>
          <p>Add a poster for the task and click submit to submit your work</p>
          <div className="submit-image">
            <div className="submit-actions">
              <button
                onClick={onClick}
                className="primary-button"
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {editable && (
                <DeleteBtn
                  id={task.slug}
                  deleteFunc={deleteFunc}
                  btnText="Delete"
                  slug={task.slug}
                  title="Delete Submission"
                >
                  Are you sure you want to delete your submission of {task.name}
                  ?
                </DeleteBtn>
              )}
            </div>
            <SubmitImage
              register={register}
              errors={errors}
              editable={editable}
            />
          </div>
        </TaskSidebarCard>
      ) : null}

      <TaskSidebarCard title={"Time left"}>
        <Counter date={task.deadline} />
      </TaskSidebarCard>

      <Submissions task={task} />
    </aside>
  );
};

const SubmitImage = ({ register, errors, editable }) => {
  const MAX_FILE_SIZE = 1024 * 1024 * 5;
  const [file, setFile] = useState(null);
  return (
    <div className="image-container">
      <label className="image-label" htmlFor="poster">
        {file ? "Added" : "Add poster"}
      </label>
      <input
        onInput={(e) => {
          console.log(e.target.files[0]);
          setFile(e.target.files[0]);
        }}
        type="file"
        accept="image/*"
        hidden
        name="poster"
        id="poster"
        {...register("poster", {
          validate: (value) => {
            if (value.length > 0 || editable) {
              if (value[0]?.size > MAX_FILE_SIZE) {
                return `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
              } else {
                return true;
              }
            } else {
              return "Please upload a poster";
            }
          },
        })}
      />
      {errors.poster && (
        <p className="error-message">{errors.poster.message}</p>
      )}
    </div>
  );
};

const Submissions = ({ task }) => {
  const [expanded, setExpanded] = useState(false);

  const sortedSubmissions = task?.submissions.sort((a, b) => {
    const dateA = new Date(a.submissionDate);
    const dateB = new Date(b.submissionDate);
    return dateB - dateA;
  });

  const filteredSubmissions = task?.champion
    ? [
        task?.submissions.find(
          (submission) => submission.username === task?.champion
        ),
        ...task?.submissions.filter(
          (submission) => submission.username !== task?.champion
        ),
      ]
    : sortedSubmissions;

  return (
    <TaskSidebarCard title={"Submissions"}>
      <>
        <ul className="top-submissions">
          {filteredSubmissions?.length > 0 ? (
            filteredSubmissions
              ?.slice(0, expanded ? task?.submissions?.length : 8)
              .map((member) => {
                return (
                  <li key={member.username}>
                    <Submitter
                      member={member}
                      url={`/task/${task?.slug}?user=${member.username}`}
                      value={dayAgo(member.submissionDate)}
                      champion={member.username === task?.champion}
                    />
                  </li>
                );
              })
          ) : (
            <EmptyData />
          )}
        </ul>

        {task?.submissions?.length > 8 && (
          <p
            className="show-more"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer" }}
          >
            {expanded ? "Show less" : "Show more"}
          </p>
        )}
      </>
    </TaskSidebarCard>
  );
};

const Submitters = ({ data, isLoading, title }) => {
  return (
    <TaskSidebarCard title={title}>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="top-submitters">
          {data?.data.map((member) => {
            return (
              <li key={member._id}>
                <Submitter
                  member={member}
                  url={`/member/${member.slug}`}
                  value={member.tasksCompleted}
                />
              </li>
            );
          })}
        </ul>
      )}
    </TaskSidebarCard>
  );
};

const Submitter = ({ member, value, url, ...rest }) => {
  const { name, branch, batch, image } = member;
  return (
    <NavLink to={url} className={"top-submitter"}>
      <div className="member-info">
        <img src={image} alt={name} />
        <div>
          <p className="member-name">
            {name}
            {rest?.champion && (
              <FontAwesomeIcon icon="fa-solid fa-crown" className="champion" />
            )}
          </p>
          <p className="member-branch-batch">
            {branch}, {batch}
          </p>
        </div>
      </div>
      <p className="value">{value}</p>
    </NavLink>
  );
};

const TaskSidebarCard = ({ title, children }) => {
  return (
    <div className="task-sidebar-card">
      <p className="task-sidebar-card-title">{title}</p>
      <div className="task-sidebar-card-content">{children}</div>
    </div>
  );
};

export { TaskSidebar, TasksSidebar, Submitter };
