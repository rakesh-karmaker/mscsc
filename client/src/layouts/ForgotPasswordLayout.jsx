import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoKeySharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const ForgotPasswordLayout = ({ title, description, children, stage }) => {
  const urls = [
    <FaLock />,
    <MdEmail />,
    <IoKeySharp />,
    <IoMdCheckmarkCircleOutline />,
  ];
  return (
    <main className="page-forgot">
      <div>
        <div className="forgot-info">
          <div className="forgot-logo row-center">{urls[stage - 1]}</div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="forgot-form">{children}</div>
        {stage !== 4 ? (
          <p className="back">
            <NavLink to="/auth/login" className="button-link">
              <span>
                <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
              </span>{" "}
              Back to Login
            </NavLink>
          </p>
        ) : null}
      </div>
    </main>
  );
};

export default ForgotPasswordLayout;
