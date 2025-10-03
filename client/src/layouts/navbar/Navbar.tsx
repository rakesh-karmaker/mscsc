import { useUser } from "@/contexts/UserContext";
import { navLinks } from "@/services/data/data";
import type React from "react";
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import NavbarToggleBtn from "./NavbarToggleBtn";
import Avatar from "@/components/ui/Avatar";

import "./navbar.css";
import PrimaryBtn from "@/components/ui/PrimaryBtn";

export default function Navbar(): React.ReactNode {
  const navBar = useRef(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  if (window.innerWidth < 800 && navLinks.length === 5) {
    navLinks.push({
      href: "/executives",
      name: "Executives",
    });
  }

  const handelNavLinkClick = () => {
    handleNavbarTogglerClick({ navbar: navBar, isOpened, setIsOpened });
  };

  const { user, isVerifying } = useUser();

  const isToken = localStorage.getItem("token") == "";

  return (
    <header id="header">
      <nav>
        <NavLink to="/" id="logo">
          <img src="/logo.webp" alt="MSCSC logo" />
        </NavLink>

        <ul className="nav-links-container" ref={navBar}>
          {navLinks.map(({ href, name }, index) => {
            return (
              <li key={index} className="nav-link">
                <NavLink to={href} onClick={handelNavLinkClick}>
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="header-right">
          {isToken ||
            (!isVerifying &&
              (user !== null ? (
                <Avatar />
              ) : (
                <PrimaryBtn
                  link="/auth/login"
                  name="Login page"
                  isHeader={true}
                >
                  Login
                </PrimaryBtn>
              )))}
          {window.innerWidth < 800 && (
            <NavbarToggleBtn
              navbar={navBar}
              setIsOpened={setIsOpened}
              isOpened={isOpened}
            />
          )}
        </div>
      </nav>
    </header>
  );
}

export function handleNavbarTogglerClick({
  navbar,
  setIsOpened,
  isOpened,
}: {
  navbar: React.RefObject<HTMLElement | null>;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  isOpened: boolean;
}) {
  setIsOpened(!isOpened);
  document.querySelector("main")?.addEventListener("click", () => {
    setIsOpened(false);
    navbar.current?.classList.remove("open");
  });
  navbar.current?.classList.toggle("open");
}
