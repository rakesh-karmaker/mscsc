import { FaBars, FaXmark } from "react-icons/fa6";
import { handleNavbarTogglerClick } from "./Navbar";
import type React from "react";

export default function NavbarToggleBtn({
  navbar,
  setIsOpened,
  isOpened,
}: {
  navbar: React.RefObject<HTMLElement | null>;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  isOpened: boolean;
}): React.ReactNode {
  return (
    <button
      className="navbar-toggler"
      onClick={() =>
        handleNavbarTogglerClick({ navbar, isOpened, setIsOpened })
      }
      type="button"
      aria-label="Toggle navbar"
    >
      {isOpened ? <FaXmark /> : <FaBars />}
    </button>
  );
}
