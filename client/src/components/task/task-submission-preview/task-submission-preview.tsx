import { useState } from "react";
import ImageViewer from "@/components/ui/image-viewer/image-viewer";
import FormattedTextContent from "@/components/ui/formatted-text-content/formatted-text-content";
import TaskSubmitter from "@/components/ui/task-submitter";
import formatDate from "@/utils/format-date";
import type { Submission, Task } from "@/types/task-types";
import { useUser } from "@/contexts/user-context";
import { ROLES } from "@/utils/require-minimum-role";

import "./task-submission-preview.css";

export default function TaskSubmissionPreview({
  submission,
  task,
}: {
  submission: Submission | undefined;
  task: Task;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  if (!submission) return null;
  return (
    <div className="preview">
      <TaskSubmitter
        submitter={submission}
        url={`/member/${submission.slug}`}
        value={formatDate(submission.submissionDate)}
        task={task}
        role={user?.role || ROLES.MEMBER}
      />

      {submission?.poster && (
        <div className="submission-image">
          <div className="poster-container" onClick={() => setOpen(true)}>
            <img src={submission?.poster} alt={submission.name} />
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
