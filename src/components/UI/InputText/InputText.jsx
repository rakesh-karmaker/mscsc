import "@/components/UI/InputText/InputText.css";
import { useState } from "react";

const InputText = ({ register, errors, children, ...rest }) => {
  const passType = rest?.type === "password";
  const inputType = rest.type ?? "text";
  const [type, setType] = useState(inputType);

  return (
    <div className="input-text">
      <input {...register} type={type} placeholder={children} required />

      {passType && <TypeToggle type={type} setType={setType} />}

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
