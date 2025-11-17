"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
  children: React.ReactNode;
  className?: string;
};

function Slide({ children, className }: SlideProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center px-8 py-16",
        className
      )}
    >
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
            <div key={slideKey} className="min-w-full flex-shrink-0">
              {slide}
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => {
          const slideKey = (slide as React.ReactElement)?.key || `slide-${index}`;
          return (
            <button
              key={`dot-${slideKey}`}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-3 w-3 rounded-full border-2 border-foreground transition-all",
                currentSlide === index
                  ? "bg-main"
                  : "bg-transparent hover:bg-main/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Slide Counter */}
      <div className="fixed bottom-8 right-8 z-50 rounded-base border-2 border-foreground bg-card px-4 py-2 text-sm font-bold text-card-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={() => setCurrentSlide((prev) => prev - 1)}
          className="fixed left-8 top-1/2 z-50 -translate-y-1/2 rounded-base border-4 border-foreground bg-main p-4 text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-none"
          aria-label="Previous slide"
        >
          ←
        </button>
      )}
      {currentSlide < totalSlides - 1 && (
        <button
          onClick={() => setCurrentSlide((prev) => prev + 1)}
          className="fixed right-8 top-1/2 z-50 -translate-y-1/2 rounded-base border-4 border-foreground bg-main p-4 text-main-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
          aria-label="Next slide"
        >
          →
        </button>
      )}
    </div>
  );
}

export { Slide };

