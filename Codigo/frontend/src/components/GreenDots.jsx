import { useMemo } from "react";

export default function GreenDots() {
  const DOT_COUNT = 70;

  const dots = useMemo(
    () =>
      [...Array(DOT_COUNT)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${6 + Math.random() * 8}s`,
        delay: `${15 + Math.random() * 20 }s`,
      })),
    []
  );

   return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm opacity-60 animate-[slow-drift_ease-in-out_infinite]"
          style={{
            backgroundColor: "#4ADE80",
            left: dot.left,
            top: dot.top,
            animationDuration: dot.duration,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}
