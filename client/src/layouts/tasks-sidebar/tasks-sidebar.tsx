import { useUser } from "@/contexts/user-context";
import { useTasks } from "@/contexts/tasks-context";
import { useRef, useEffect, useState } from "react";
import TopTaskSubmitters from "@/components/tasks/top-task-submitters";
import TaskSidebarCard from "@/components/ui/task-sidebar-card";
import { ROLES } from "@/utils/require-minimum-role";

import "./tasks-sidebar.css";

export default function TasksSidebar({
  isDashboard,
}: {
  isDashboard?: boolean;
}) {
  const { response, params, setParams } = useTasks();
  const { user } = useUser();
  const totalLengthRef = useRef<null | number>(null);
  const [initialTotalLength, setInitialTotalLength] = useState<null | number>(
    null,
  );

  const categories = ["Article Writing", "Poster Design"];

  // Set the initial value of totalLengthRef
  //TODO: This is a half-baked solution, but it works for now only if there are no filters applied. We need to find a better way to do this.
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
                (category === params.category ? " active" : "")
              }
              onClick={() =>
                setParams({
                  ...params,
                  category: category.toLowerCase() as
                    | "article writing"
                    | "poster design",
                  page: 1,
                })
              }
            >
              {category}
            </p>
          );
        })}
      </TaskSidebarCard>

      {isDashboard || !user ? null : (
        <TaskSidebarCard title={"Task Completed"}>
          <p className="task-number">
            <span>{user?.submissions.length}</span>
            <span>/</span>
            <span>{initialTotalLength}</span>
          </p>
        </TaskSidebarCard>
      )}

      <TopTaskSubmitters role={user?.role || ROLES.MEMBER} />
    </aside>
  );
}
