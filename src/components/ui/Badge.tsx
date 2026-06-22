import React from 'react';

export function Badge({ text, variant = "red" }: { text: string; variant?: "red" | "yellow" | "blue" | "burst" }) {
  const base = "inline-block font-bold text-xs tracking-wider px-2 py-0.5 border-2 border-black uppercase";
  if (variant === "yellow") return <span className={`${base} bg-[#F5C518] text-black`} style={{ fontFamily: "Bangers, cursive", fontSize: "14px", letterSpacing: "0.05em" }}>{text}</span>;
  if (variant === "blue") return <span className={`${base} bg-[#1A4FCC] text-white`} style={{ fontFamily: "Bangers, cursive", fontSize: "14px" }}>{text}</span>;
  if (variant === "burst") return (
    <span className="inline-flex items-center justify-center w-14 h-14 bg-[#F5C518] text-black font-bold text-[10px] text-center border-2 border-black" style={{
      fontFamily: "Bangers, cursive", fontSize: "11px", letterSpacing: "0.02em",
      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
    }}>{text}</span>
  );
  return <span className={`${base} bg-[#C8181E] text-white`} style={{ fontFamily: "Bangers, cursive", fontSize: "14px" }}>{text}</span>;
}
