import { useState } from "react";

const SubmitImage = ({ register, errors, didSubmit, imageRequired }) => {
  const MAX_FILE_SIZE = 1024 * 1024 * 2;
  const [file, setFile] = useState(null);
  return (
    <div className="image-container">
      <label className="image-label" htmlFor="poster">
        {file ? "Added" : "Add Image"}
      </label>
      <input
        onInput={(e) => {
          setFile(e.target.files[0]);
        }}
        type="file"
        accept="image/*"
        hidden
        name="poster"
        id="poster"
        {...register("poster", {
          validate: (value) => {
            if (value.length > 0 || didSubmit || !imageRequired) {
              if (value[0]?.size > MAX_FILE_SIZE) {
                return `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
              } else {
                return true;
              }
            } else {
              return "Please upload a Image";
            }
          },
        })}
      />
      {errors.poster && (
        <p className="error-message">{errors.poster.message}</p>
      )}
    </div>
  );
};

export default SubmitImage;
