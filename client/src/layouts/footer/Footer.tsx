import type { ReactNode } from "react";
import FooterLinks from "./FooterLinks";

import "./footer.css";

export default function Footer(): ReactNode {
  return (
    <footer className="col-center">
      <div className="footer-upper-container">
        <div className="footer-desc">
          <img src="/logo.webp" alt="MSCSC logo" />

          <p>
            MSCSC is the ideal place for Math, Science, Biology, IT, and
            Astronomy enthusiasts, offering top-notch learning, hands-on
            experiences, and expert guidance.
          </p>
        </div>

        <FooterLinks />
      </div>

      <div className="line"></div>

      <p className="copyright">
        © {new Date().getFullYear()} MSCSC || All Rights Reserved
      </p>
    </footer>
  );
}
