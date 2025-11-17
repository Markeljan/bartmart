"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
  children: React.ReactNode;
  className?: string;
};

function Slide({ children, className }: SlideProps) {
  return (
    <div className={cn("flex min-h-screen w-full flex-col items-center justify-center px-8 py-16", className)}>
      {children}
    </div>
  );
}

type PresentationProps = {
  slides: React.ReactNode[];
  className?: string;
};

export function Presentation({ slides, className }: PresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setCurrentSlide(totalSlides - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  return (
    <div className={cn("relative h-screen w-full overflow-hidden", className)}>
      {/* Slide Container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => {
          // Use the key from the slide element if available, otherwise use index
          const slideKey = (slide as React.ReactElement)?.key || `slide-${index}`;
          return (
            <div className="min-w-full flex-shrink-0" key={slideKey}>
              {slide}
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="-translate-x-1/2 fixed bottom-8 left-1/2 z-50 flex gap-2">
        {slides.map((slide, index) => {
          const slideKey = (slide as React.ReactElement)?.key || `slide-${index}`;
          return (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-3 w-3 rounded-full border-2 border-foreground transition-all",
                currentSlide === index ? "bg-main" : "bg-transparent hover:bg-main/50"
              )}
              key={`dot-${slideKey}`}
              onClick={() => goToSlide(index)}
              type="button"
            />
          );
        })}
      </div>

      {/* Slide Counter */}
      <div className="fixed right-8 bottom-8 z-50 rounded-base border-2 border-foreground bg-card px-4 py-2 font-bold text-card-foreground text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          aria-label="Previous slide"
          className="-translate-y-1/2 fixed top-1/2 left-8 z-50 rounded-base border-4 border-foreground bg-main p-4 text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-none"
          onClick={() => setCurrentSlide((prev) => prev - 1)}
          type="button"
        >
          ←
        </button>
      )}
      {currentSlide < totalSlides - 1 && (
        <button
          aria-label="Next slide"
          className="-translate-y-1/2 fixed top-1/2 right-8 z-50 rounded-base border-4 border-foreground bg-main p-4 text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
          onClick={() => setCurrentSlide((prev) => prev + 1)}
          type="button"
        >
          →
        </button>
      )}
    </div>
  );
}

export { Slide };
