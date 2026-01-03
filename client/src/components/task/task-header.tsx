import { IoIosCreate } from "react-icons/io";
import type { Task } from "@/types/task-types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import formatDate from "@/utils/format-date";

type TaskHeaderProps = {
  task: Task;
  mode: "edit" | "preview";
  setMode: Dispatch<SetStateAction<"edit" | "preview">>;
  showModeChanger: boolean;
};

export default function TaskHeader({
  task,
  mode,
  setMode,
  showModeChanger,
}: TaskHeaderProps): ReactNode {
  return (
    <div className="task-header">
      <h2 className="task-name">{task.name}</h2>
      <p className="created flex gap-1 items-center">
        <IoIosCreate /> <span>{formatDate(task.createdAt)}</span>
      </p>
      {showModeChanger && (
        <div className="mode-btns">
          <button
            className={`mode ${mode === "edit" ? "active" : ""}`}
            onClick={() => setMode("edit")}
          >
            Edit Mode
          </button>
          <button
            className={`mode ${mode === "preview" ? "active" : ""}`}
            onClick={() => setMode("preview")}
          >
            Preview Mode
          </button>
        </div>
      )}
    </div>
  );
}
