import "./InputText.css";

const InputText = ({ register, errors, children, ...rest }) => {
  return (
    <div className="input-text">
      <input
        {...register}
        type={rest.type ?? "text"}
        placeholder={children}
        required
      />
      {errors && <p className="error-message">{errors.message}</p>}
    </div>
  );
};

export default InputText;
