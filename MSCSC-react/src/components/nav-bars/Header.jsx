// import NavLink from "./NavLink";
import { NavLink } from "react-router-dom";
import $ from "jquery";
import "./Header.css";

const Header = ({ page }) => {
  // const navLinks = [
  //   {
  //     to: "/",
  //     name: "Home",
  //   },
  //   {
  //     to: "/home#about",
  //     name: "About Us",
  //   },
  //   {
  //     to: "/activities",
  //     name: "Activities",
  //   },
  //   {
  //     to: "/executives",
  //     name: "Executives",
  //   },
  //   {
  //     to: "/contact",
  //     name: "Contact",
  //   },
  // ];
  return (
    <header>
      <nav>
        <div id="logo">
          <img src="/logo.png" alt="MSCSC logo" />
        </div>

        {window.innerWidth > 800 ? null : <NavbarToggler />}
        {/* <ul className="nav-links-container">
          {navLinks.map(({ to, name }, index) => {
            <li key={index}>
              <NavLink to={to} className="nav-link">
                {name}
              </NavLink>
            </li>;
          })}
        </ul> */}
        <Navbar />
      </nav>
    </header>
  );
};

const Navbar = () => {
  // const navLinks = [
  //   {
  //     to: "/",
  //     name: "Home",
  //   },
  //   {
  //     to: "/home#about",
  //     name: "About Us",
  //   },
  //   {
  //     to: "/activities",
  //     name: "Activities",
  //   },
  //   {
  //     to: "/executives",
  //     name: "Executives",
  //   },
  //   {
  //     to: "/contact",
  //     name: "Contact",
  //   },
  // ];
  // console.log(navLinks);
  return (
    <ul className="nav-links-container">
      {/* {navLinks.map((link) => {
        <li key={link.name}>
          <NavLink to={link.to} className="nav-link">
            {link.name}
          </NavLink>
        </li>;
      })} */}
      <li>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/home#about" className="nav-link">
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/activities" className="nav-link">
          Activities
        </NavLink>
      </li>
      <li>
        <NavLink to="/executives" className="nav-link">
          Executives
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>
      </li>
    </ul>
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
