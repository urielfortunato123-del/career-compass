import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "fade";
  delay?: number;
  duration?: number;
}

export function ScrollAnimation({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 0.6,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const animationStyles: Record<string, { initial: string; animate: string }> = {
    "fade-up": {
      initial: "opacity-0 translate-y-8",
      animate: "opacity-100 translate-y-0",
    },
    "fade-left": {
      initial: "opacity-0 -translate-x-8",
      animate: "opacity-100 translate-x-0",
    },
    "fade-right": {
      initial: "opacity-0 translate-x-8",
      animate: "opacity-100 translate-x-0",
    },
    scale: {
      initial: "opacity-0 scale-95",
      animate: "opacity-100 scale-100",
    },
    fade: {
      initial: "opacity-0",
      animate: "opacity-100",
    },
  };

  const style = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className} ${
        isVisible ? style.animate : style.initial
      }`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
