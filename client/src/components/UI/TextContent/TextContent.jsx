import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./TextContent.css";

const TextContent = ({ content }) => {
  return (
    <div className="content-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default TextContent;
