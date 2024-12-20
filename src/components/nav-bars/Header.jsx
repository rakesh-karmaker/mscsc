// import NavLink from "./NavLink";
import { NavLink } from "react-router-dom";
import $ from "jquery";
import "./Header.css";

const Header = () => {
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

        {window.innerWidth > 800 ? null : <NavbarToggler />}
        <ul className="nav-links-container">
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

const NavbarToggler = () => {
  const handleNavbarTogglerClick = () => {
    $(".nav-links-container").slideToggle("fast");
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
