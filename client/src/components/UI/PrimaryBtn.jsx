import { Link } from "react-router-dom";

const PrimaryBtn = ({ link, children, name, ...rest }) => {
  return (
    <Link
      to={link}
      className={`primary-button ${rest.header ? "header-btn" : ""}`}
      aria-label={`Go to ${name}`}
    >
      {children}
    </Link>
  );
};

export default PrimaryBtn;
