import NavLink from "./NavLink";
import $ from "jquery";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <nav>
        <div id="logo">
          <img src="/logo.png" alt="MSCSC logo" />
        </div>

        {window.innerWidth > 800 ? null : <NavbarToggler />}
        <Navbar />
      </nav>
    </header>
  );
};

const Navbar = () => {
  return (
    <ul className="nav-links-container">
      <NavLink href="/home">Home</NavLink>
      <NavLink href="/home#about">About Us</NavLink>
      <NavLink href="/activities" dropdown="true">
        Activities
        <ul className="activities">
          <NavLink href="/home#events" innerClass="events-link">
            Events
          </NavLink>
          <NavLink href="/home#articles" innerClass="articles-link">
            Articles
          </NavLink>
        </ul>
      </NavLink>
      <NavLink href="/executives">Executives</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </ul>
  );
};

const NavbarToggler = () => {
  const handleNavbarTogglerClick = () => {
    $(".nav-links-container").slideToggle("fast");
  };

  return (
    <button className="navbar-toggler" onClick={handleNavbarTogglerClick}>
      <i className="fa-solid fa-bars"></i>
    </button>
  );
};

export default Header;
