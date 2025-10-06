import type { Executive } from "@/types/executiveTypes";
import { useEffect, type ReactNode } from "react";
import ExecutiveCard from "@/components/ui/executiveCard/ExecutiveCard";
import PrimaryBtn from "@/components/ui/PrimaryBtn";
import SectionHeader from "@/components/ui/SectionHeader";

export default function HomeExecutivesContainer({
  data,
}: {
  data: Executive[];
}): ReactNode {
  const filteredEcs = data.slice(0, 4);
  useEffect(() => {
    document
      .querySelectorAll(".executive-member")
      .forEach((executiveMember) => {
        observeExecutiveMember.observe(executiveMember);
      });
  });

  return (
    <section
      id="executives"
      className="page-section col-center w-full h-full gap-5 bg-secondary-bg !py-32.5"
    >
      <div className="w-full max-w-max-width">
        <SectionHeader
          title="Executives"
          description="Members that are administrating the club for years "
        >
          <PrimaryBtn link="/executives" name="See More">
            See Others
          </PrimaryBtn>
        </SectionHeader>
        <div className="mt-12 w-full flex flex-warp gap-15">
          {filteredEcs.map((ec) => (
            <ExecutiveCard key={ec.name} executiveData={ec} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
