import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="row-center">
      <div>
        <p>© 2024 MSCSC || All Rights Reserved</p>

        <div className="socials row-center">
          <FooterLink
            link="https://www.facebook.com/MSCSC2014"
            title="Facebook"
          >
            <FontAwesomeIcon icon="fa-brands fa-facebook" />
          </FooterLink>

          <FooterLink
            link="https://www.instagram.com/_mscsclub_/"
            title="Instagram"
          >
            <FontAwesomeIcon icon="fa-brands fa-instagram" />
          </FooterLink>

          <FooterLink link="mailto:mscscofficial17@gmail" title="Email us">
            <FontAwesomeIcon icon="fa-regular fa-envelope" />
          </FooterLink>

          <FooterLink link="tel: 01329-600430" title="Call us">
            <FontAwesomeIcon icon="fa-solid fa-phone" />
          </FooterLink>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = (prams) => {
  return (
    <a
      href={prams.link}
      target="_blank"
      className="row-center"
      title={prams.title}
      aria-label={`Go to our ${prams.title} page`}
    >
      {prams.children}
    </a>
  );
};

export default Footer;
