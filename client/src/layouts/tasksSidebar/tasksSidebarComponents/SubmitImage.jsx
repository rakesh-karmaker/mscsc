import { useState } from "react";

const SubmitImage = ({ register, errors, editable }) => {
  const MAX_FILE_SIZE = 1024 * 1024 * 5;
  const [file, setFile] = useState(null);
  return (
    <div className="image-container">
      <label className="image-label" htmlFor="poster">
        {file ? "Added" : "Add poster"}
      </label>
      <input
        onInput={(e) => {
          console.log(e.target.files[0]);
          setFile(e.target.files[0]);
        }}
        type="file"
        accept="image/*"
        hidden
        name="poster"
        id="poster"
        {...register("poster", {
          validate: (value) => {
            if (value.length > 0 || editable) {
              if (value[0]?.size > MAX_FILE_SIZE) {
                return `Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
              } else {
                return true;
              }
            } else {
              return "Please upload a poster";
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
