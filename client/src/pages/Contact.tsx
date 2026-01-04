import ContactContainer from "@/components/contact/contact-container";
import { Helmet } from "react-helmet-async";

export default function ContactPage() {
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Contact us</title>
        <meta property="og:title" content="MSCSC - Contact us" />
        <meta name="twitter:title" content="MSCSC - Contact us" />
        <meta name="og:url" content="https://mscsc.netlify.app/contact" />
        <link rel="canonical" href={`https://mscsc.netlify.app/contact`} />
      </Helmet>

      {/* page content */}
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
