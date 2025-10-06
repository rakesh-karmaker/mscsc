import { FaCheck, FaCloudArrowUp } from "react-icons/fa6";
import { useRef, useState } from "react";

import "./imageDropper.css";

export default function ImageDropper({
  title,
  register,
  name,
}: {
  title: string;
  register: any;
  name: string;
}) {
  const dropArea = useRef(null);
  const [files, setFiles] = useState(0);
  const [active, setActive] = useState(false);

  const handleDrop = (
    e: React.InputEvent<HTMLLabelElement> | React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e?.type === "input") {
      const droppedFiles = (e.target as HTMLInputElement).files;
      register.onChange({
        target: {
          name: name,
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles?.length || 0);
    } else if ("dataTransfer" in e) {
      const droppedFiles = e.dataTransfer.files;
      register.onChange({
        target: {
          name: name,
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles.length);
    }
    setActive(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (files == 0) setActive(false);
  };

  return (
    <div className="image-dropper">
      <p className="input-heading">{title}</p>
      <label
        className={`${files || active ? "active" : ""} drop-area`}
        htmlFor={name}
        ref={dropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onInput={handleDrop}
      >
        <input type="file" id={name} accept="image/*" multiple hidden />
        <div className="drop-icon">
          {files ? (
            <>
              <FaCheck />
              <p>{files} Images Selected Successfully</p>
            </>
          ) : (
            <>
              <FaCloudArrowUp />
              <p>Drag & Drop or Click to upload</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}
