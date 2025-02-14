import TextContent from "@/components/UI/TextContent/TextContent";
import Editor from "@/components/UI/Editor/Editor";
import "./Submission.css";

const Submission = ({
  task,
  username,
  formRef,
  onSubmit,
  register,
  handleSubmit,
}) => {
  const submission = task?.submissions?.find((s) => s.username === username);

  return (
    <>
      <div className="instructions">
        <div>
          <h3 className="instructions-title">Instructions</h3>
          <TextContent content={task.instructions} />
        </div>
        {username ? (
          <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <h3 className="instructions-title">Answer</h3>
            <Editor
              key={submission ? submission._id : "new"}
              content={submission?.answer || ""}
              register={register("content")}
              placeholder="Type your answer here…"
            />
          </form>
        ) : null}
      </div>
    </>
  );
};

export default Submission;
