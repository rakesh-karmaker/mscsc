import { useEffect, type ReactNode } from "react";
import ExecutiveCard from "@/components/ui/executive-card/executive-card";
import PrimaryBtn from "@/components/ui/primary-btn";
import SectionHeader from "@/components/ui/section-header";
import type { ExecutivesData } from "@/types/executive-types";

export default function HomeExecutivesContainer({
  data,
}: {
  data: ExecutivesData;
}): ReactNode {
  const latestPanel: string = Object.keys(data)[0];
  const filteredEcs = data[latestPanel].slice(0, 4);

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
        <div className="mt-12 w-full flex flex-wrap gap-15">
          {filteredEcs.map((ec) => (
            <ExecutiveCard
              key={ec.name}
              executiveData={ec}
              panel={latestPanel}
            />
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
