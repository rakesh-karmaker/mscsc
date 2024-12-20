import SectionHeader from "../../UI/SectionHeader";
import PrimaryBtn from "../../UI/PrimaryBtn";
import ExecutiveCard from "../../UI/ExecutiveCard";
import { useEffect } from "react";
import "./HomeEcs.css";

const HomeEcs = ({ data }) => {
  const filteredEcs = data.slice(0, 4);
  useEffect(() => {
    document
      .querySelectorAll(".executive-member")
      .forEach((executiveMember) => {
        observeExecutiveMember.observe(executiveMember);
      });
  });
  return (
    <section id="executives" className="page-section col-center">
      <div>
        <SectionHeader
          title="Executives"
          description="Members that are administrating the club for years "
        >
          <PrimaryBtn link="/executives" name="See More">
            See Others
          </PrimaryBtn>
        </SectionHeader>
        <div className="executives-container">
          {filteredEcs.map((ec) => (
            <ExecutiveCard key={ec.name} executiveData={ec} />
          ))}
        </div>
      </div>
    </section>
  );
};

const observeExecutiveMember = new IntersectionObserver(
  (executiveMembers) => {
    executiveMembers.forEach((executiveMember) => {
      if (executiveMember.isIntersecting) {
        executiveMember.target.classList.add("shown");
        observeExecutiveMember.unobserve(executiveMember.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);
export default HomeEcs;
