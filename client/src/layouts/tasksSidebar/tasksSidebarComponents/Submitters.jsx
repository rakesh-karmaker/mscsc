import Loader from "@/components/UI/Loader/Loader";
import { Submitter, TaskSidebarCard } from "../TasksSidebar";

import { useQuery } from "@tanstack/react-query";
import { getTopSubmitters } from "@/services/GetService";
import useErrorNavigator from "@/hooks/useErrorNavigator";

const Submitters = ({ title }) => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topSubmitters"],
    queryFn: getTopSubmitters,
  });

  useErrorNavigator(isError, error);

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
