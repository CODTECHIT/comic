import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Comic } from '../../types';
import { SpeechBubbleBadge } from '../ui/SpeechBubbleBadge';
import { ComicCard } from './ComicCard';

interface ComicRowProps {
  title: string;
  badge?: string;
  comics: Comic[];
  onComicClick: (comic: Comic) => void;
  onViewAll: () => void;
}

export function ComicRow({ title, badge, comics, onComicClick, onViewAll }: ComicRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {badge && <SpeechBubbleBadge text={badge} />}
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "0.05em", color: "#0D0D0D" }}>
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#C8181E] hover:text-white hover:border-[#C8181E] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll(1)} className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#C8181E] hover:text-white hover:border-[#C8181E] transition-colors">
              <ChevronRight size={16} />
            </button>
            <button onClick={onViewAll} className="ml-2 text-[#C8181E] font-bold text-sm flex items-center gap-1 hover:text-[#0D0D0D] transition-colors" style={{ fontFamily: "DM Sans, sans-serif" }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1 bg-[#0D0D0D]" />
          <div className="w-3 h-3 bg-[#C8181E] rotate-45" />
          <div className="flex-1 h-0.5 bg-[#0D0D0D]/30" />
        </div>

        <div ref={ref} className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {comics.map((c) => (
            <ComicCard key={c._id || c.id} comic={c} onClick={() => onComicClick(c)} />
          ))}
        </div>
      </div>
    </section>
  );
}
