import { footerLinks } from "@/services/data/data";
import type { ReactNode } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function FooterLinks(): ReactNode {
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
            <FaEnvelope /> mscscofficial17@gmail
          </Link>
          <Link to="tel: 01329-600430">
            <FaPhoneAlt /> +880 1329-600430
          </Link>
        </div>
      </div>
    </div>
  );
}

function FooterLink({
  children,
  link,
  objectKey,
}: {
  children: ReactNode;
  link: string;
  objectKey: string;
}): ReactNode {
  const url = useLocation();
  const searchParams = new URLSearchParams(url.search);
  const linkTag = searchParams.get("tag");

  return objectKey === "Socials" ? (
    <Link to={link} aria-label={`Go to our ${children} page`}>
      {children}
    </Link>
  ) : linkTag ? (
    <NavLink
      to={link}
      aria-label={`Go to our ${children} page`}
      className={(_) =>
        children?.toString().slice(0, -1) === linkTag ? "active" : ""
      }
    >
      {children}
    </NavLink>
  ) : (
    <NavLink to={link} aria-label={`Go to our ${children} page`}>
      {children}
    </NavLink>
  );
}
