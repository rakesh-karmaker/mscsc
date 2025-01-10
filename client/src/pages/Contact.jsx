import Contact from "@/components/contact-components/ContactSection";
import MetaTags from "@/layout/MetaTags";

const ContactPage = () => {
  return (
    <>
      <MetaTags
        title="MSCSC - Contact Us"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
      <main
        className="page-contact row-center"
        style={{
          marginTop: "var(--nav-height)",
          minHeight: "calc(100vh - var(--nav-height))",
        }}
      >
        <Contact style={{ height: "100vh" }} />
      </main>
    </>
  );
};

export default ContactPage;
