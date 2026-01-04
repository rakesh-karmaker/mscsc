import type { ReactNode } from "react";

type ClubBenefitProps = {
  icon: string;
  title: string;
  children: ReactNode;
  marginBottom?: string;
};

export default function ClubBenefit({
  icon,
  title,
  children,
  marginBottom,
}: ClubBenefitProps): ReactNode {
  const margin = marginBottom ? marginBottom : "0px";
  const style = { marginBottom: margin };
  return (
    <div className="benefit">
      <img style={style} src={`/icons/${icon}`} alt={`A ${title} icon`} />
      <h3>{title}</h3>
      <p className="secondary-text">{children}</p>
    </div>
  );
}
