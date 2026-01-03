import AboutContainer from "@/components/about/about-container/about-container";
import type { ReactNode } from "react";

export default function AboutPage(): ReactNode {
  return (
    <>
      <main
        style={{ marginTop: "var(--nav-height)", width: "100%" }}
        className="page-about"
      >
        <AboutContainer />
      </main>
    </>
  );
}
