import AboutUs from "@/components/aboutComponents/aboutSection/AboutSection";
const AboutPage = () => {
  return (
    <>
      <main
        style={{ marginTop: "var(--nav-height)", width: "100%" }}
        className="page-about"
      >
        <AboutUs />
      </main>
    </>
  );
};

export default AboutPage;
