import "@/components/UI/InputText/InputText.css";
import { useEffect } from "react";
import { useState } from "react";

const InputText = ({ register, errors, children, id, ...rest }) => {
  const passType = rest?.type === "password";
  const inputType = rest.type ?? "text";
  const [type, setType] = useState(inputType);

  const [labelTop, setLabelTop] = useState(
    rest?.type === "date" ? "-25px" : "0"
  );
  useEffect(() => {
    setLabelTop(document.getElementById(id).value ? "-25px" : labelTop);
  });
  const handleInputChange = (e) => {
    // console.log(e.target.value);
    if (e.target.value !== "") {
      setLabelTop("-25px");
    } else {
      setLabelTop("0");
    }
  };

  return (
    <div className="input-text">
      <div className="input-container">
        <label htmlFor={id} style={{ top: labelTop }}>
          {children}
        </label>
        <input
          {...register}
          type={type}
          id={id}
          onChange={handleInputChange}
          required={rest?.required ?? true}
        />
        {passType && <TypeToggle type={type} setType={setType} />}
      </div>

      {errors && <p className="error-message">{errors.message}</p>}
    </div>
  );
};

export const TextArea = ({ register, errors, children }) => {
  return (
    <div className="input-text">
      <textarea {...register} placeholder={children} required />

      {errors && <p className="error-message">{errors.message}</p>}
    </div>
  );
};

const TypeToggle = ({ type, setType }) => {
  const handleTypeToggleClick = () => {
    setType(type === "password" ? "text" : "password");
  };

  return (
    <button onClick={handleTypeToggleClick} className="type-toggle">
      {type === "password" ? (
        <i className="fa-solid fa-eye-slash"></i>
      ) : (
        <i className="fa-solid fa-eye"></i>
      )}
    </button>
  );
};

export default InputText;
