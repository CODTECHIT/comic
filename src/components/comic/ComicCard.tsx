import React, { useState } from 'react';
import { Comic } from '../../types';
import { Badge } from '../ui/Badge';
import { HalftoneOverlay } from '../ui/HalftoneOverlay';

interface ComicCardProps {
  comic: Comic;
  onClick: () => void;
}

export function ComicCard({ comic, onClick }: ComicCardProps) {
  const [hovered, setHovered] = useState(false);
  const badgeVariant = comic.badge === "NEW" ? "red" : comic.badge === "HOT" ? "blue" : comic.badge === "BUY & WIN" ? "burst" : "yellow";

  return (
    <div
      className="relative flex-shrink-0 w-[140px] sm:w-44 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className="border-4 border-black overflow-hidden"
        style={{
          transform: hovered ? "translate(-3px,-5px)" : "translate(0,0)",
          transition: "transform 0.15s ease",
          boxShadow: hovered ? "6px 8px 0 #0D0D0D" : "3px 4px 0 #0D0D0D",
        }}
      >
        <div className="relative bg-[#0D0D0D]" style={{ aspectRatio: "2/3" }}>
          <img
            src={comic.img || comic.coverImage || '/images/comic-1.jpeg'}
            alt={comic.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/comic-1.jpeg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <HalftoneOverlay opacity={0.08} />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white font-bold leading-tight" style={{ fontFamily: "Bangers, cursive", fontSize: "15px", textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 2px 2px 4px rgba(0,0,0,0.8)" }}>
              {comic.title}
            </p>
          </div>
          {comic.badge && (
            <div className="absolute top-2 right-2">
              {comic.badge === "BUY & WIN"
                ? <Badge text="BUY & WIN" variant="burst" />
                : <Badge text={comic.badge} variant={badgeVariant as "red" | "yellow" | "blue"} />
              }
            </div>
          )}
        </div>
        <div className="bg-[#FAFAF7] p-2 border-t-4 border-black">
          <p className="font-bold text-black" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>₹{comic.price.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}
