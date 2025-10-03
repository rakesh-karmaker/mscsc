import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { NavLink } from "react-router-dom";

const AllDone = () => {
  return (
    <ForgotPasswordLayout
      title="All done!"
      description="Your password has been reset. You can now login with your new password."
      stage={4}
    >
      <div className="done-btns">
        <NavLink to="/auth/login" className="primary-button">
          Login
        </NavLink>
      </div>
    </ForgotPasswordLayout>
  );
};

export default AllDone;
