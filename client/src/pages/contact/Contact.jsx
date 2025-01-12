import Contact from "@/components/contactComponents/ContactSection";

const ContactPage = () => {
  return (
    <>
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
