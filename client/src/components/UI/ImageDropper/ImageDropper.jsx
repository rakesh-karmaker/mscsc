import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ImageDropper.css";
import { useRef, useState } from "react";

const ImageDropper = ({ title, register }) => {
  const dropArea = useRef(null);
  const [files, setFiles] = useState(0);
  const [active, setActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e?.type === "input") {
      const droppedFiles = e.target.files;
      register.onChange({
        target: {
          name: "gallery",
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles.length);
    } else {
      const droppedFiles = e.dataTransfer.files;
      register.onChange({
        target: {
          name: "gallery",
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles.length);
    }
    setActive(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (files == 0) setActive(false);
  };

  return (
    <div className="image-dropper">
      <p className="input-heading">{title}</p>
      <label
        className={`${files || active ? "active" : ""} drop-area`}
        htmlFor="gallery"
        ref={dropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onInput={handleDrop}
      >
        <input type="file" id="gallery" accept="image/*" multiple hidden />
        <div className="drop-icon">
          {files ? (
            <>
              <FontAwesomeIcon icon="fa-solid fa-check" />
              <p>{files} Images Selected Successfully</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" />
              <p>Drag & Drop or Click to upload</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageDropper;
