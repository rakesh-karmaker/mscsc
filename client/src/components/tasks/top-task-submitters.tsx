import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { getTopSubmitters } from "@/lib/api/task";
import type { TaskSubmitterType, TopSubmitter } from "@/types/task-types";
import TaskSidebarCard from "../ui/task-sidebar-card";
import Loader from "../ui/loader/loader";
import TaskSubmitter from "../ui/task-submitter";
import type { Role } from "@/utils/require-minimum-role";

export default function TopTaskSubmitters({ role }: { role: Role }) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["topSubmitters"],
    queryFn: () => getTopSubmitters().then((res) => res.data),
  });

  useErrorNavigator(isError, error);
  const topSubmitters: TopSubmitter[] = data?.topSubmitters || [];

  return (
    <TaskSidebarCard title={"Top Submitters"}>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="top-submitters">
          {topSubmitters.map((topSubmitter: TopSubmitter) => {
            const submitter: TaskSubmitterType = {
              memberId: topSubmitter._id,
              name: topSubmitter.name,
              slug: topSubmitter.slug,
              branch: topSubmitter.branch,
              batch: topSubmitter.batch,
              image: topSubmitter.image,
              isImageHidden: topSubmitter.isImageHidden,
              isImageVerified: topSubmitter.isImageVerified,
              submissionDate: "", // Not needed here
            };

            return (
              <li key={topSubmitter._id}>
                <TaskSubmitter
                  submitter={submitter}
                  url={`/member/${topSubmitter.slug}`}
                  value={topSubmitter.submissionCount}
                  role={role}
                />
              </li>
            );
          })}
        </ul>
      )}
    </TaskSidebarCard>
  );
}
