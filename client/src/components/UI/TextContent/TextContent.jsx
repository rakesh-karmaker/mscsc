import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./TextContent.css";

const TextContent = ({ content }) => {
  return (
    <div className="content-container">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
};

export default TextContent;
