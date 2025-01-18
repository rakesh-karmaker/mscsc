import { Link, NavLink } from "react-router-dom";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="col-center">
      <div className="footer-upper-container">
        <FooterDesc />

        <FooterLinks />
      </div>

      <div className="line"></div>

      <p className="copyright">
        © {new Date().getFullYear()} MSCSC || All Rights Reserved
      </p>
    </footer>
  );
};

const FooterDesc = () => {
  return (
    <div className="footer-desc">
      <img src="/logo.webp" alt="MSCSC logo" />

      <p>
        MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy
        enthusiasts, offering top-notch learning, hands-on experiences, and
        expert guidance.
      </p>
    </div>
  );
};

const FooterLinks = () => {
  return (
    <div className="footer-links">
      {Object.keys(footerLinks).map((key) => {
        return (
          <div key={key} className={key.toLocaleLowerCase()}>
            <h3 className="footer-link-title">{key}</h3>
            <div className="footer-link-container">
              {footerLinks[key].map((link) => {
                return (
                  <FooterLink key={link.title} link={link.link} objectKey={key}>
                    {link.title}
                  </FooterLink>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="contact-us">
        <h3 className="footer-link-title">Contact Us</h3>
        <div className="footer-link-container">
          <Link to="mailto:mscscofficial17@gmail">
            <FontAwesomeIcon icon="fa-regular fa-envelope" />{" "}
            mscscofficial17@gmail
          </Link>
          <Link to="tel: 01329-600430">
            <FontAwesomeIcon icon="fa-solid fa-phone" /> +880 1329-600430
          </Link>
        </div>
      </div>
    </div>
  );
};

const FooterLink = ({ link, children, objectKey }) => {
  return objectKey === "Socials" ? (
    <Link to={link} aria-label={`Go to our ${children} page`}>
      {children}
    </Link>
  ) : (
    <NavLink to={link}>{children}</NavLink>
  );
};

const footerLinks = {
  Pages: [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "About Us",
      link: "/about",
    },
    {
      title: "Members",
      link: "/members",
    },
    {
      title: "Executives",
      link: "/executives",
    },
    {
      title: "Contact Us",
      link: "/contact",
    },
  ],
  Activities: [
    {
      title: "Events",
      link: "/activities?tag=Event",
    },
    {
      title: "Workshops",
      link: "/activities?tag=Workshop",
    },
    {
      title: "Articles",
      link: "/activities?tag=Article",
    },
    {
      title: "Achievements",
      link: "/activities?tag=Achievement",
    },
  ],
  Links: [
    {
      title: "Privacy Policy",
      link: "/privacy-policy",
    },
    {
      title: "Terms of Service",
      link: "/terms-of-service",
    },
    {
      title: "Facebook",
      link: "https://www.facebook.com/MSCSC2014",
    },
    {
      title: "Instagram",
      link: "https://www.instagram.com/_mscsclub_/",
    },
  ],
};

export default Footer;
