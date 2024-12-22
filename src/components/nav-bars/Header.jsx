import { NavLink } from "react-router-dom";
import "@/components/nav-bars/Header.css";
import { useRef } from "react";

const Header = () => {
  const navBar = useRef(null);

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
      href: "/activities",
      name: "Activities",
    },
    {
      href: "/executives",
      name: "Executives",
    },
    {
      href: "/contact",
      name: "Contact",
    },
  ];

  const handelNavLinkClick = () => {
    window.scrollTo(0, 0);
  };
  return (
    <header>
      <nav>
        <div id="logo">
          <img src="/logo.jpeg" alt="MSCSC logo" />
        </div>

        {window.innerWidth > 800 ? null : <NavbarToggler navbar={navBar} />}
        <ul className="nav-links-container" ref={navBar}>
          {navLinks.map(({ href, name }, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={href}
                  className="nav-link"
                  onClick={handelNavLinkClick}
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

const NavbarToggler = ({ navbar }) => {
  const handleNavbarTogglerClick = () => {
    navbar.current.classList.toggle("open");
  };

  return (
    <button
      className="navbar-toggler"
      onClick={handleNavbarTogglerClick}
      type="button"
      aria-label="Toggle navbar"
    >
      <i className="fa-solid fa-bars"></i>
    </button>
  );
};

export default Header;
