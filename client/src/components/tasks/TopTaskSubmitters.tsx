import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { getTopSubmitters } from "@/lib/api/task";
import type { TaskSubmitterType, TopSubmitter } from "@/types/taskTypes";
import TaskSidebarCard from "../ui/TaskSidebarCard";
import Loader from "../ui/loader/Loader";
import TaskSubmitter from "../ui/TaskSubmitter";

export default function TopTaskSubmitters() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topSubmitters"],
    queryFn: getTopSubmitters,
  });

  useErrorNavigator(isError, error);

  return (
    <TaskSidebarCard title={"Top Submitters"}>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="top-submitters">
          {data?.data.map((topSubmitter: TopSubmitter) => {
            const submitter: TaskSubmitterType = {
              name: topSubmitter.name,
              username: topSubmitter.slug,
              branch: topSubmitter.branch,
              batch: topSubmitter.batch,
              image: topSubmitter.image,
              isImageHidden: topSubmitter.isImageHidden,
              submissionDate: "", // Not needed here
            };

            return (
              <li key={topSubmitter._id}>
                <TaskSubmitter
                  submitter={submitter}
                  url={`/member/${topSubmitter.slug}`}
                  value={topSubmitter.submissionCount}
                />
              </li>
            );
          })}
        </ul>
      )}
    </TaskSidebarCard>
  );
}
