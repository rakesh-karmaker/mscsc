import { FaEnvelope, FaFacebook, FaPhoneAlt } from "react-icons/fa";
import type { ReactNode } from "react";
import ContactInfo from "./ContactInfo";
import ContactForm from "@/components/forms/contactForm/ContactForm";

import "./contactContainer.css";

export default function ContactContainer(): ReactNode {
  return (
    <section id="contact" className="page-section">
      <div className="contact-details">
        <h3 className="highlighted-text">Contact us</h3>
        <h2 className="section-heading">DROP US A MESSAGE</h2>
        <p className="secondary-text">
          We’re here to help you at anytime ! Drop us a message, and our club
          will get back to you as soon as possible. Whether you have inquiries,
          feedback, or just want to say how can we help you, it would be our
          pleasure to hear from you!
        </p>
        <div className="contacts-container">
          <ContactInfo
            title="Call us"
            href="tel: 01644-330810"
            content="+880 1644-330810"
          >
            <FaPhoneAlt />
          </ContactInfo>
          <ContactInfo
            title="Email us"
            href="mailto:mscscofficial17@gmail"
            content="mscscofficial17@gmail.com"
          >
            <FaEnvelope />
          </ContactInfo>
          <ContactInfo
            title="Facebook"
            href="https://www.facebook.com/MSCSC2014"
            content="Monipur School & College Science Club - MSCSC"
          >
            <FaFacebook />
          </ContactInfo>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
