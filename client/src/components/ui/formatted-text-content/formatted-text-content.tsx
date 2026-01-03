import "./formatted-text-content.css";

export default function FormattedTextContent({ content }: { content: string }) {
  return (
    <div className="content-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
