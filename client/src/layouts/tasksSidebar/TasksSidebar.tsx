import { useUser } from "@/contexts/UserContext";
import { useTasks } from "@/contexts/TasksContext";
import { useRef, useEffect, useState } from "react";
import TopTaskSubmitters from "@/components/tasks/TopTaskSubmitters";
import TaskSidebarCard from "@/components/ui/TaskSidebarCard";

import "./tasksSidebar.css";

export default function TasksSidebar({ admin }: { admin?: boolean }) {
  const { category: currentCategory, setCategory, response } = useTasks();
  const { user } = useUser();
  const totalLengthRef = useRef<null | number>(null);
  const [initialTotalLength, setInitialTotalLength] = useState<null | number>(
    null
  );

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

      {admin || !user ? null : (
        <TaskSidebarCard title={"Task Completed"}>
          <p className="task-number">
            <span>{user?.submissions.length}</span>
            <span>/</span>
            <span>{initialTotalLength}</span>
          </p>
        </TaskSidebarCard>
      )}

      <TopTaskSubmitters />
    </aside>
  );
}
