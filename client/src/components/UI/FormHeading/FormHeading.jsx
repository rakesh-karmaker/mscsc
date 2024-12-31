import "./FormHeading.css";

const FormHeading = ({ children, ...rest }) => {
  return (
    <h2 className="form-heading" style={rest?.style}>
      {children}
    </h2>
  );
};

export default FormHeading;
