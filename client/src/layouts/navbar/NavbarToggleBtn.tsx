import { FaBars, FaXmark } from "react-icons/fa6";
import { handleNavbarTogglerClick } from "./Navbar";
import type { ReactNode, RefObject, Dispatch, SetStateAction } from "react";

export default function NavbarToggleBtn({
  navbar,
  setIsOpened,
  isOpened,
}: {
  navbar: RefObject<HTMLElement | null>;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  isOpened: boolean;
}): ReactNode {
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
