import AboutContainer from "@/components/about/aboutContainer/AboutContainer";
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
