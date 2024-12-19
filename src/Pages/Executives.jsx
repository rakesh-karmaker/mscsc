import "../components/ec-components/Executives.css";
import executivesData from "../api/executivesData.json";
import ExecutivesContainer from "../components/ec-components/ExecutivesContainer";

const Executives = () => {
  let years = [];
  for (let executive of executivesData) {
    if (!years.includes(executive.panel)) {
      years.push(executive.panel);
    }
  }

  return (
    <main className="page-executives">
      <h1 className="section-heading">
        Meet Our <span className="highlighted-text">Executives</span>
      </h1>
      <section className="executive-panel-container">
        <ExecutivesContainer years={years} executivesData={executivesData} />
      </section>
    </main>
  );
};

export default Executives;
