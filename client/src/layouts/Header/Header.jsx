import { NavLink } from "react-router-dom";
import "./Header.css";
import { useRef, useState } from "react";
import PrimaryBtn from "@/components/UI/PrimaryBtn";
import { useUser } from "@/contexts/UserContext";
import Avatar from "@/components/UI/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const navBar = useRef(null);
  const [isOpened, setIsOpened] = useState(false);

  const navLinks = [
    {
      href: "/",
      name: "Home",
    },
    {
      href: "/about",
      name: "About Us",
    },
    {
      href: "/members",
      name: "Members",
    },
    {
      href: "/activities",
      name: "Activities",
    },
    {
      href: "/contact",
      name: "Contact",
    },
  ];

  if (window.innerWidth < 800) {
    navLinks.push({
      href: "/executives",
      name: "Executives",
    });
  }

  const handelNavLinkClick = () => {
    handleNavbarTogglerClick({ navbar: navBar, isOpened, setIsOpened });
  };

  const { user, isVerifying } = useUser();

  return (
    <header>
      <nav>
        {window.innerWidth > 800 ? (
          <NavLink to="/" id="logo">
            <img src="/logo.webp" alt="MSCSC logo" />
          </NavLink>
        ) : (
          <NavbarToggler
            navbar={navBar}
            isOpened={isOpened}
            setIsOpened={setIsOpened}
          />
        )}

        <ul className="nav-links-container" ref={navBar}>
          {navLinks.map(({ href, name }, index) => {
            return (
              <li key={index} className="nav-link">
                <NavLink
                  to={href}
                  // className="nav-link"
                  onClick={handelNavLinkClick}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        {!isVerifying &&
          (user !== null ? (
            <Avatar />
          ) : (
            <PrimaryBtn link="/login" name="Login page" header={true}>
              Login
            </PrimaryBtn>
          ))}
      </nav>
    </header>
  );
};

const NavbarToggler = ({ navbar, isOpened, setIsOpened }) => {
  return (
    <button
      className="navbar-toggler"
      onClick={() =>
        handleNavbarTogglerClick({ navbar, isOpened, setIsOpened })
      }
      type="button"
      aria-label="Toggle navbar"
    >
      {isOpened ? (
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      ) : (
        <FontAwesomeIcon icon="fa-solid fa-bars" />
      )}
    </button>
  );
};

const handleNavbarTogglerClick = ({ navbar, setIsOpened, isOpened }) => {
  setIsOpened(!isOpened);
  document.querySelector("main").addEventListener("click", () => {
    setIsOpened(false);
    navbar.current.classList.remove("open");
  });
  navbar.current.classList.toggle("open");
};

export default Header;
