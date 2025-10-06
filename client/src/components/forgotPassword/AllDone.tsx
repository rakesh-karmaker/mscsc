import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function AllDone(): ReactNode {
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
}
