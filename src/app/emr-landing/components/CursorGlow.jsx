"use client";
import React, { useEffect, useState } from "react";

/* Cursor-following soft glow for dark aesthetic */
export const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      className="cursor-glow hidden md:block"
      style={{ transform: `translate(${pos.x - 250}px, ${pos.y - 250}px)` }}
      aria-hidden="true"
    />
  );
};
export default CursorGlow;
