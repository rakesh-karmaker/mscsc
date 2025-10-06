import type { TermsAndPolicyContentType } from "@/services/data/termsAndPolicyData";
import type { ReactNode } from "react";

export default function KeyPoints({
  content,
}: {
  content: TermsAndPolicyContentType[];
}): ReactNode {
  return (
    <aside className="key-points">
      <h2 className="aside-heading">Key Points</h2>
      <ul className="key-points-list">
        {content.map((keyPoint, index) => (
          <li key={keyPoint.title} className="key-point-item">
            <a href={`#${keyPoint.id}`}>
              {index + 1}. {keyPoint.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
