import "./Footer.css";

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
            <i className="fa-brands fa-facebook"></i>
          </FooterLink>

          <FooterLink
            link="https://www.instagram.com/_mscsclub_/"
            title="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </FooterLink>

          <FooterLink link="mailto:mscscofficial17@gmail" title="Email us">
            <i className="fa-solid fa-envelope"></i>
          </FooterLink>

          <FooterLink link="tel: 01329-600430" title="Call us">
            <i className="fa-solid fa-phone"></i>
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
    >
      {prams.children}
    </a>
  );
};

export default Footer;
