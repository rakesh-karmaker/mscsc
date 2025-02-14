import Loader from "@/components/UI/Loader/Loader";
import { Submitter, TaskSidebarCard } from "../TasksSidebar";

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

export default Submitters;
