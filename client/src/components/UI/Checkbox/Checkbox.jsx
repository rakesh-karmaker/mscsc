import "./Checkbox.css";

const CheckBox = ({ children, id, onChange, ...rest }) => {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={id}
        className="checkbox"
        onChange={onChange}
        {...rest?.register}
      />
      <label htmlFor={id} className="checkbox-label">
        {children}
      </label>
    </div>
  );
};

export default CheckBox;
