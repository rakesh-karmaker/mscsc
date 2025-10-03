import { NavLink } from "react-router-dom";
import "./Error.css";

const Error = ({ heading, link, linkText, children, ...rest }) => {
  const style = rest?.style ?? {};
  return (
    <div className="error-container">
      <h2 className="error-heading" style={style}>
        {heading}
      </h2>
      {children}
      <NavLink to={link} className="primary-button error-link">
        {linkText}
      </NavLink>
    </div>
  );
};

const ErrorContent = ({ message, children }) => {
  return (
    <div className="error-content">
      <h3 className="error-info">{message}</h3>
      <p className="error-text">{children}</p>
    </div>
  );
};

export { Error, ErrorContent };
