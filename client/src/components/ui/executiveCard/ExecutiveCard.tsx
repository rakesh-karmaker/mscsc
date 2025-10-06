import type { Executive } from "@/types/executiveTypes";
import type { ReactNode } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ExecutiveSocials from "./ExecutiveSocialLinks";

import "./executiveCard.css";

export default function ExecutiveCard({
  executiveData,
}: {
  executiveData: Executive;
}): ReactNode {
  const { name, position, image, socials, panel } = executiveData;
  return (
    <div className="executive-member">
      <div>
        <div className="executive-upper">
          <LazyLoadImage
            src={`/executive-members/${image}`}
            alt={`A picture of ${name}, our ${position} of MSCSC in ${panel}`}
            effect="blur"
          />

          <div className="member-socials row-center">
            <ExecutiveSocials socials={socials} name={name} />
          </div>
        </div>
        <div className="executive-lower col-center">
          <p>{name}</p>
          <p className="secondary-text">{position}</p>
        </div>
      </div>
    </div>
  );
}
