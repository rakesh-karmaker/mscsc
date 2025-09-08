import executivesData from "@/services/data/executivesData";
import ExecutivesContainer from "@/components/executivesComponents/ExecutivesContainer";
import "./Executives.css";

const Executives = () => {
  let years = [];
  for (let executive of executivesData) {
    if (!years.includes(executive.panel)) {
      years.push(executive.panel);
    }
  }

  return (
    <>
      <main className="page-executives">
        <h1 className="section-heading">
          Meet Our <span className="highlighted-text">Executives</span>
        </h1>
        <section className="executive-panel-container">
          <ExecutivesContainer years={years} executivesData={executivesData} />
        </section>
      </main>
    </>
  );
};

export default Executives;
