import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export function HeroActionBtns(): ReactNode {
  return (
    <div className="hero-action-btns row-center">
      <NavLink className={"primary-button"} to="/auth/register">
        Join Us
      </NavLink>
      <NavLink className={"primary-button secondary-button"} to="/members">
        See Others
      </NavLink>
    </div>
  );
}

export function HeroActionBtn(): ReactNode {
  return (
    <NavLink className={"join-btn"} to="/auth/register">
      <div>
        <div className="pulse row-center"></div>
        <p>Join Us With Our Journey</p>
      </div>
      <p>
        <FaArrowRight />
      </p>
    </NavLink>
  );
}
