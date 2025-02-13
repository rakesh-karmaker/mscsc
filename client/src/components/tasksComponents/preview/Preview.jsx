import { Submitter } from "@/layouts/tasksSidebar/TasksSidebar";
import dateFormat from "@/utils/dateFormat";

import "./Preview.css";
import ImageViewer from "@/components/UI/ImageViewer/ImageViewer";
import { useState } from "react";
import TextContent from "@/components/UI/TextContent/TextContent";

const Preview = ({ submission, champion }) => {
  const [open, setOpen] = useState(false);

  if (!submission) return null;
  return (
    <div className="preview">
      <Submitter
        member={submission}
        url={`/member/${submission.username}`}
        value={dateFormat(submission.submissionDate)}
        champion={champion === submission.username}
      />
      <div className="submission-image">
        <div className="poster-container" onClick={() => setOpen(true)}>
          <img
            src={
              submission?.poster
                ? submission.poster
                : "https://ik.imagekit.io/testingimage/1738172492248-456490966_907851081382599_3782313942744084034_n_hHwYmVxq-.jpg"
            }
            alt={submission.username}
          />
          <p>View full poster</p>
        </div>
        <button onClick={() => setOpen(true)} className="image-preview-btn">
          View full poster
        </button>
      </div>

      <TextContent content={submission.answer} />

      <ImageViewer
        data={[
          {
            url: submission?.poster
              ? submission.poster
              : "https://ik.imagekit.io/testingimage/1738172492248-456490966_907851081382599_3782313942744084034_n_hHwYmVxq-.jpg",
          },
        ]}
        open={open}
        setOpen={setOpen}
        index={0}
      />
    </div>
  );
};

export default Preview;
