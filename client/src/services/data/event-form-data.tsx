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
    "segments",
    "experiences",
    "schedule",
    "sp",
    "faqs",
  ],
};

export const sectionsTitle: { [section: string]: string } = {
  basic: "Create New Event",
  hero: "Website Hero Section",
  video: "Website Video Section",
  about: "About the Event Section",
  segments: "Event Segments Section",
  experiences: "Experiences Section",
  schedule: "Event Schedule Section",
  sp: "Sponsors & Partners Section",
  faqs: "FAQs Section",
  final: "Finalize Event Creation",
};
