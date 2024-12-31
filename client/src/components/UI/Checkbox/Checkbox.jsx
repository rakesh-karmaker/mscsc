import "./Checkbox.css";

const CheckBox = ({ children, id, onChange }) => {
  return (
    <div className="checkbox-container">
      <input type="checkbox" id={id} className="checkbox" onChange={onChange} />
      <label htmlFor={id} className="checkbox-label">
        {children}
      </label>
    </div>
  );
};

export default CheckBox;
