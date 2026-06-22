import React from 'react';

export function HalftoneOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
        backgroundSize: "12px 12px",
        opacity,
      }}
    />
  );
}
