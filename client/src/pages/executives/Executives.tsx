import type { ReactNode } from "react";
import executivesData from "@/services/data/executivesData.json";
import ExecutivesContainer from "@/components/executives/ExecutivesContainer";

import "./executives.css";

export default function Executives(): ReactNode {
  return (
    <>
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
