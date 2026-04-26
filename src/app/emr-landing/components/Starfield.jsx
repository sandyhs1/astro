"use client";
import React, { useMemo } from "react";

/* Multi-layer Starfield with shooting stars */
export const Starfield = ({ count = 100, shootingStars = 2, className = "" }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 0.4,
        dur: 3 + Math.random() * 8,
        delay: Math.random() * 6,
        max: 0.3 + Math.random() * 0.7,
      })),
    [count]
  );
  const shoots = useMemo(
    () =>
      Array.from({ length: shootingStars }).map((_, i) => ({
        id: i,
        top: Math.random() * 50,
        left: Math.random() * 50,
        delay: i * 2,
      })),
    [shootingStars]
  );
  return (
    <div className={`starfield ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
            "--max-op": s.max,
          }}
        />
      ))}
      {shoots.map((s) => (
        <span
          key={`sh-${s.id}`}
          className="shoot"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
