import { Submitter } from "@/layouts/tasksSidebar/TasksSidebar";
import dateFormat from "@/utils/dateFormat";
import ImageViewer from "@/components/UI/ImageViewer/ImageViewer";
import { useState } from "react";
import TextContent from "@/components/UI/TextContent/TextContent";

import "./Preview.css";

const Preview = ({ submission, task }) => {
  const [open, setOpen] = useState(false);

  if (!submission) return null;
  return (
    <div className="preview">
      <Submitter
        member={submission}
        url={`/member/${submission.username}`}
        value={dateFormat(submission.submissionDate)}
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

      <TextContent content={submission.answer} />

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
};

export default Preview;
