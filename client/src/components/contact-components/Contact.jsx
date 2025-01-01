import ContactForm from "@/components/contact-components/ContactForm";
import "@/components/contact-components/Contact.css";

const Contact = () => {
  return (
    <section id="contact" className="page-section">
      <div className="contact-details">
        <h3 className="highlighted-text">Contact us</h3>
        <h2 className="section-heading">DROP US A MESSAGE</h2>
        <p className="secondary-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it
        </p>
        <div className="contacts-container">
          <ContactInfo
            methodName="Call us"
            href="tel: 01329-600430"
            content="+880 1329-600430"
          >
            <i className="fa-solid fa-phone"></i>
          </ContactInfo>
          <ContactInfo
            methodName="Email us"
            href="mailto:mscscofficial17@gmail"
            content="mscscofficial17@gmail.com"
          >
            <i className="fa-solid fa-envelope"></i>
          </ContactInfo>
          <ContactInfo
            methodName="Facebook"
            href="https://www.facebook.com/MSCSC2014"
            content="Monipur School & College Science Club - MSCSC"
          >
            <i className="fa-brands fa-facebook"></i>
          </ContactInfo>
        </div>
      </div>
      <ContactForm />
    </section>
  );
};

const ContactInfo = ({ children, methodName, href, content }) => {
  return (
    <div className="contact">
      <div className="icon row-center">
        <p>{children}</p>
      </div>
      <div className="info">
        <p className="method-name">{methodName}</p>
        <a href={href} target="_blank" title="Call us" className="content">
          {content}
        </a>
      </div>
    </div>
  );
};

export default Contact;
