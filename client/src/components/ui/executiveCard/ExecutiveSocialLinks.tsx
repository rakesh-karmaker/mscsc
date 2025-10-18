import type { Executive } from "@/types/executiveTypes";
import SocialIcon from "@/utils/SocialIcon";
import type { ReactNode } from "react";

import { Link } from "react-router-dom";

export default function ExecutiveSocials({
  socials,
  name,
}: {
  socials: Executive["socials"];
  name: string;
}): ReactNode {
  type SocialKey = keyof typeof socials;
  const socialsList = Object.keys(socials).filter(
    (key): key is SocialKey => socials[key as SocialKey] !== undefined
  );

  if (socialsList.length > 0) {
    return (
      <>
        {socialsList.map((social) => {
          const url = socials[social];
          if (!url) return null;
          return (
            <Link
              key={social}
              to={url}
              className="row-center"
              title={social}
              aria-label={`Go to ${name}'s ${social} page`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon social={social} />
            </Link>
          );
        })}
      </>
    );
  } else {
    return null;
  }
}
