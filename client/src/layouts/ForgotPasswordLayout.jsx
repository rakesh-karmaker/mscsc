import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ForgotPasswordLayout = ({ title, description, image, children }) => {
  return (
    <main className="page-forgot">
      <div>
        <div className="forgot-info">
          <div className="forgot-logo row-center">
            <img src={"/icons" + image} alt="logo" />
          </div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="forgot-form">{children}</div>
        <p className="back">
          <NavLink to="/login" className="button-link">
            <span>
              <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            </span>{" "}
            Back to Login
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default ForgotPasswordLayout;
