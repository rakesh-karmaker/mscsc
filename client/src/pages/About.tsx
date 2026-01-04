import AboutContainer from "@/components/about/about-container/about-container";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export default function AboutPage(): ReactNode {
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - About us</title>
        <meta property="og:title" content="MSCSC - About us" />
        <meta name="twitter:title" content="MSCSC - About us" />
        <meta name="og:url" content="https://mscsc.netlify.app/about" />
        <link rel="canonical" href={`https://mscsc.netlify.app/about`} />
      </Helmet>

      {/* page content */}
      <main
        style={{ marginTop: "var(--nav-height)", width: "100%" }}
        className="page-about"
      >
        <AboutContainer />
      </main>
    </>
  );
}
