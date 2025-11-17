"use client";

import { Presentation } from "@/components/deck/presentation";
import {
  ClosingSlide,
  IntegrationsSlide,
  ProblemSlide,
  SolutionSlide,
  TitleSlide,
  UseCasesSlide,
} from "@/components/deck/slides";

export default function DeckPage() {
  const slides = [
    <TitleSlide key="title" />,
    <ProblemSlide key="problem" />,
    <SolutionSlide key="solution" />,
    <IntegrationsSlide key="integrations" />,
    <UseCasesSlide key="use-cases-roadmap-get-involved" />,
    <ClosingSlide key="closing" />,
  ];

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Background Image */}
      <div
        className="-z-10 fixed inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/simpsons-1600x900.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      />
      {/* Overlay for readability */}
      <div className="-z-10 fixed inset-0 bg-background/70 backdrop-blur-[1px] dark:bg-background/85" />

      <Presentation slides={slides} />
    </div>
  );
}
