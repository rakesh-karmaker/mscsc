import type { ReactNode } from "react";
import executivesData from "@/services/data/executives-data.json";
import ExecutivesContainer from "@/components/executives/executives-container";
import { Helmet } from "react-helmet-async";

import "./executives.css";

export default function Executives(): ReactNode {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Executives</title>
        <meta property="og:title" content={`MSCSC - Executives`} />
        <meta name="twitter:title" content={`MSCSC - Executives`} />
        <meta name="og:url" content={`https://mscsc.netlify.app/executives`} />
        <link rel="canonical" href={`https://mscsc.netlify.app/executives`} />
      </Helmet>

      {/* page content */}
      <main className="page-executives">
        <h1 className="section-heading">
          Meet Our <span className="highlighted-text">Executives</span>
        </h1>
        <section className="executive-panel-container">
          <ExecutivesContainer executivesData={executivesData} />
        </section>
      </main>
    </>
  );
}
