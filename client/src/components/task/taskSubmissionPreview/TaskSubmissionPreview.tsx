import { useState } from "react";
import ImageViewer from "@/components/ui/imageViewer/ImageViewer";
import FormattedTextContent from "@/components/ui/formattedTextContent/FormattedTextContent";
import TaskSubmitter from "@/components/ui/TaskSubmitter";
import formatDate from "@/utils/formatDate";
import type { Submission, Task } from "@/types/taskTypes";

import "./taskSubmissionPreview.css";

export default function TaskSubmissionPreview({
  submission,
  task,
}: {
  submission: Submission;
  task: Task;
}) {
  const [open, setOpen] = useState(false);

  if (!submission) return null;
  return (
    <div className="preview">
      <TaskSubmitter
        submitter={submission}
        url={`/member/${submission.username}`}
        value={formatDate(submission.submissionDate)}
        task={task}
      />

      {submission?.poster && (
        <div className="submission-image">
          <div className="poster-container" onClick={() => setOpen(true)}>
            <img src={submission?.poster} alt={submission.username} />
            <p>View full poster</p>
          </div>
          <button onClick={() => setOpen(true)} className="image-preview-btn">
            View full poster
          </button>
        </div>
      )}

      <FormattedTextContent content={submission.answer || ""} />

      {submission?.poster && (
        <ImageViewer
          data={[
            {
              url: submission?.poster,
            },
          ]}
          open={open}
          setOpen={setOpen}
          index={0}
        />
      )}
    </div>
  );
}
