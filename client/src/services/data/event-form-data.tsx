import type { ReactNode } from "react";

export const sectionsData: {
  title: string;
  description: ReactNode;
  sectionOptions: string[];
} = {
  title: "Sections",
  description: (
    <p className="w-full min-w-[30ch] h-full">Sections for the event.</p>
  ),
  sectionOptions: [
    "hero",
    "video",
    "about",
    "events",
    "segments",
    "schedule",
    "sp",
    "faqs",
    "contact",
  ],
};
