import Contact from "@/components/contactComponents/ContactSection";

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
        <Contact style={{ height: "100vh" }} />
      </main>
    </>
  );
}
