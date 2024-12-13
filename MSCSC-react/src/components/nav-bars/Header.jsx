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
      <NavLink href="/home" name="home">
        Home
      </NavLink>
      <NavLink href="/home#about" name="about">
        About Us
      </NavLink>
      <NavLink href="/activities" dropdown="true" name="activities">
        Activities
        <ul className="activities">
          <NavLink href="/home#event" innerClass="events-link" name="events">
            Events
          </NavLink>
          <NavLink
            href="/home#articles"
            innerClass="articles-link"
            name="articles"
          >
            Articles
          </NavLink>
        </ul>
      </NavLink>
      <NavLink href="/executives" name="executives">
        Executives
      </NavLink>
      <NavLink href="/contact" name="contact">
        Contact
      </NavLink>
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
