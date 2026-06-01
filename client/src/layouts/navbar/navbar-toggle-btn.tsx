import FaBars6 from "~icons/fa6-solid/bars";
import FaXmark from "~icons/fa6-solid/xmark";
import { handleNavbarTogglerClick } from "./navbar";
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
      className="navbar-toggler flex justify-center items-center"
      onClick={() =>
        handleNavbarTogglerClick({ navbar, isOpened, setIsOpened })
      }
      type="button"
      aria-label="Toggle navbar"
    >
      {isOpened ? <FaXmark /> : <FaBars6 />}
    </button>
  );
}
