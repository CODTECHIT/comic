import React from 'react';

export function SpeechBubbleBadge({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <div className="bg-[#F5C518] border-2 border-black px-3 py-1 text-black font-bold text-xs uppercase" style={{ fontFamily: "Bangers, cursive", fontSize: "13px", letterSpacing: "0.05em" }}>
        {text}
      </div>
      <div className="absolute -bottom-2 left-4 w-3 h-3 bg-[#F5C518] border-b-2 border-r-2 border-black" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
    </div>
  );
}
