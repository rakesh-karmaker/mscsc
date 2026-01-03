import type { ReactNode } from "react";

type WelcomeProps = {
  name: string;
  image: string;
};

export default function Welcome({ name, image }: WelcomeProps): ReactNode {
  return (
    <div className="welcome">
      <img src={image} alt={`Pic of ${name}`} />
      <div>
        <h2>{name}</h2>
        <p className="sub-text">Welcome</p>
      </div>
    </div>
  );
}
