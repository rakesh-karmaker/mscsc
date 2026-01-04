import type { ReactNode } from "react";
import FormattedTextContent from "@/components/ui/formatted-text-content/formatted-text-content";
import type { Task } from "@/types/task-types";
import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";

type TaskSubmissionFormProps = {
  task: Task;
  username: string;
  formRef: React.RefObject<HTMLFormElement>;
  onSubmit: (data: { content: string; poster: FileList }) => void;
  register: UseFormRegister<{ content: string; poster: FileList }>;
  handleSubmit: UseFormHandleSubmit<{ content: string; poster: FileList }>;
  canSubmit: boolean;
};

export default function TaskSubmissionForm({
  task,
  username,
  formRef,
  onSubmit,
  register,
  handleSubmit,
  canSubmit,
}: TaskSubmissionFormProps): ReactNode {
  const submission = task?.submissions?.find((s) => s.username === username);

  return (
    <>
      <div className="flex flex-col gap-[0.7em]">
        <div>
          <h3 className="text-2xl font-semibold">Instructions</h3>
          <FormattedTextContent content={task.instructions} />
        </div>
        {canSubmit ? (
          <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <h3 className="text-2xl font-semibold !mb-2">Answer</h3>
            <RichTextEditor
              key={submission ? submission.username : "new"}
              content={submission?.answer || ""}
              register={register}
            />
          </form>
        ) : null}
      </div>
    </>
  );
}
