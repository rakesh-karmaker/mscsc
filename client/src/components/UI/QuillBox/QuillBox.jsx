import { useRef, useEffect, useState } from "react";
// import Quill from "quill";
import { useWatch } from "react-hook-form";
// import "quill/dist/quill.snow.css";
import "./QuillBox.css";
import { htmlToMarkdown, markdownToHtml } from "@/utils/Parser";
import ReactMarkdown from "react-markdown";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, false] }],

  ["bold", "italic", "underline", "blockquote"], // toggled buttons

  [
    { list: "ordered" },
    { list: "bullet" },
    { align: [] },
    { indent: "-1" },
    { indent: "+1" },
  ],

  ["link"],

  [
    {
      color: [
        "#3b82f6",
        "#ffffff",
        "#c9e0ff",
        "#f9f9f9",
        "#f3f4f6",
        "#e5e7eb",
        "#e11d48",
        "#ef4444",
        "#f87171",
        "#fbbf24",
        "#f59e0b",
        "#f97316",
        "#fbbf24",
        "#f59e0b",
        "#f97316",
        "#f59e0b",
        "#f97316",
        "#f59e0b",
        "#11181c",
      ],
    },
    { background: [] },
  ], // dropdown with defaults from theme

  ["clean"], // remove formatting button
];

const QuillBox = ({ register, content }) => {
  const [value, setValue] = useState(markdownToHtml(content));
  const reactQuillRef = useRef(null);

  const onChange = (c) => {
    setValue(c);
    register.onChange({
      target: { name: "content", value: htmlToMarkdown(c) },
    });
  };

  return (
    <div>
      <h3 className="input-heading" style={{ marginBottom: "1rem" }}>
        Activity Description
      </h3>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        placeholder="Start writing..."
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS,
          },
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default QuillBox;
