import type { ReactNode } from "react";

export default function ContactInformation({
  info,
  children,
}: {
  info: { [key: string]: ReactNode };
  children: ReactNode;
}): ReactNode {
  return (
    <div className="about-info">
      <p className="about-info-header">{children}</p>
      <InformationItem info={info} />
    </div>
  );
}

function InformationItem({
  info,
}: {
  info: { [key: string]: ReactNode };
}): ReactNode {
  return (
    <>
      {Object.keys(info).map((key) => (
        <p key={key} className="about-info-item flex">
          <span className="about-info-key">{key}: </span>
          <span className="about-info-value">{info[key]}</span>
        </p>
      ))}
    </>
  );
}
