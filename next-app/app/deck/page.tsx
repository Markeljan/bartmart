"use client";

import { Presentation } from "@/components/deck/presentation";
import {
  ClosingSlide,
  ContractFlowSlide,
  NextStepsSlide,
  ProblemSlide,
  ResultSlide,
  SolutionSlide,
  TitleSlide,
} from "@/components/deck/slides";

export default function DeckPage() {
  const slides = [
    <TitleSlide key="title" />,
    <ProblemSlide key="problem" />,
    <SolutionSlide key="solution" />,
    <ContractFlowSlide key="contract-flow" />,
    <ResultSlide key="result" />,
    <NextStepsSlide key="next-steps" />,
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
