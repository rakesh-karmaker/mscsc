import "./TextContent.css";

const TextContent = ({ content }) => {
  return (
    <div className="content-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default TextContent;
