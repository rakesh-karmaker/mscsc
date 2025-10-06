import ContactContainer from "@/components/contact/ContactContainer";

export default function ContactPage() {
  return (
    <>
      <main
        className="page-contact row-center"
        style={{
          marginTop: "var(--nav-height)",
          minHeight: "calc(100vh - var(--nav-height))",
        }}
      >
        <ContactContainer />
      </main>
    </>
  );
}
