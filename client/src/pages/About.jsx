import AboutUs from "@/components/about-components/AboutSection";
import MetaTags from "@/layout/MetaTags";
const AboutPage = () => {
  return (
    <>
      <MetaTags
        title="MSCSC - About Us"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
      <main style={{ marginTop: "var(--nav-height)" }} className="page-about">
        <AboutUs />
      </main>
    </>
  );
};

export default AboutPage;
