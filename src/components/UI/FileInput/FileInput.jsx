import { useRef } from "react";

import "./FileInput.css";
const FileInput = ({ register, errors, children }) => {
  const labelRef = useRef();

  const handleFileInput = (e) => {
    if (e.target.files.length) {
      const fileName = e.target.files[0].name;
      labelRef.current.innerHTML = fileName;
    } else {
      labelRef.current.innerHTML = "File Required";
    }
  };

  return (
    <div className="file-input">
      <p className="input-heading">{children}</p>
      <input
        {...register}
        id="file"
        type="file"
        required
        onInput={(e) => handleFileInput(e)}
      />
      <label
        ref={labelRef}
        htmlFor="file"
        className="highlighted-text file-label"
      >
        <i className="fa-solid fa-upload"></i> <span>Upload File</span>
      </label>

      {errors && <p className="error-message">{errors.message}</p>}
    </div>
  );
};

export default FileInput;
