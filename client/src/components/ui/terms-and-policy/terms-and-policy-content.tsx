import type { TermsAndPolicyContentType } from "@/services/data/terms-data";
import type { ReactNode } from "react";

import "./terms-and-policy.css";

export default function TermsAndPolicyContent({
  content,
  page,
}: {
  content: TermsAndPolicyContentType[];
  page: "terms" | "privacy";
}): ReactNode {
  return (
    <section className="terms-policy-content">
      {page === "terms" && (
        <p>
          Welcome to the Monipur School and College Science Club (MSCSC)! By
          accessing or using our website, you agree to the following terms and
          conditions. Please read them carefully.
        </p>
      )}
      {content.map((item, index) => (
        <TermsAndPolicyItem
          key={item.id}
          title={item.title}
          content={item.content}
          list={item.list}
          index={index + 1}
          id={item.id}
        />
      ))}
      <p className="last-updated">Last Updated: 18-01-2025</p>
    </section>
  );
}

function TermsAndPolicyItem({
  title,
  content,
  list,
  index,
  id,
}: TermsAndPolicyContentType & { index: number }): ReactNode {
  return (
    <div className="terms-policy-item">
      <h2 id={`${id}`}>
        {index}. {title}
      </h2>
      <p>{content}</p>
      {list && (
        <ul>
          {list.map((item, i) => (
            <li key={id + item + i}>
              <span className="bullet"></span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
