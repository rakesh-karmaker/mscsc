import "@/components/UI/InputText/InputText.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const InputText = ({
  register,
  errors,
  children,
  id,
  setValue,
  trigger,
  ...rest
}) => {
  const inputType = rest.type ?? "text";
  const isRequired = rest?.required ? rest?.required : true;
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
          {...register(id)}
          type={type}
          id={id}
          onChange={handleInputChange}
          {...(isRequired && { required: true })}
          onInput={(e) => {
            setValue(id, e.target.value);
            trigger(id);
          }}
        />
        {inputType === "password" && (
          <TypeToggle type={type} setType={setType} />
        )}
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
    <button
      onClick={handleTypeToggleClick}
      className="type-toggle"
      type="button"
    >
      {type === "password" ? (
        <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
      ) : (
        <FontAwesomeIcon icon="fa-regular fa-eye" />
      )}
    </button>
  );
};

export default InputText;
