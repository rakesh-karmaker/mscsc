import { IoIosCreate } from "react-icons/io";
import dateFormat from "@/utils/dateFormat";

const TaskHeader = ({ task, mode, setMode, showModeChanger }) => {
  return (
    <div className="task-header">
      <h2 className="task-name">{task.name}</h2>
      <p className="created">
        <IoIosCreate /> <span>{dateFormat(task.createdAt)}</span>
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
};

export default TaskHeader;
