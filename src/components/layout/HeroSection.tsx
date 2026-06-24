import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { HeroSlide } from '../../types';
import { HalftoneOverlay } from '../ui/HalftoneOverlay';
import { SpeechBubbleBadge } from '../ui/SpeechBubbleBadge';
import { API_URL } from "../../config/api";
import { Badge } from '../ui/Badge';

export function HeroSection() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/heroslides`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setLocalSlides(data);
      })
      .catch(err => console.error("Failed to fetch hero slides:", err));
  }, []);

  const go = (dir: number) => {
    if (animating || localSlides.length === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setIdx((i) => (i + dir + localSlides.length) % localSlides.length);
      setAnimating(false);
    }, 250);
  };

  useEffect(() => {
    if (localSlides.length === 0) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [idx, localSlides, go]);

  const comic: any = localSlides[idx];

  if (!comic) return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center font-bold text-white" style={{ minHeight: "92vh", background: "#0D0D0D" }}>
      <div className="text-[#F5C518] mb-4">
        <span style={{ fontFamily: "Bangers, cursive", fontSize: "40px", letterSpacing: "0.05em" }}>LOADING UNIVERSE...</span>
      </div>
      <p className="text-white/50 text-sm">Waiting for hero slides to be configured.</p>
    </div>
  );

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "92vh", background: "#0D0D0D" }}>
      <HalftoneOverlay opacity={0.12} />

      {/* Background art */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: animating ? 0 : 1 }}>
        <img
          src={comic.img || comic.image}
          alt={comic.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.25, mixBlendMode: "luminosity" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${comic.accentColor || '#C8181E'}CC 0%, #0D0D0D 60%)` }} />
      </div>

      {/* Panel border overlay */}
      <div className="absolute inset-4 border-4 border-white/10 pointer-events-none" />
      <div className="absolute inset-2 border border-white/5 pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-24 flex items-center" style={{ minHeight: "92vh" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          {/* Text side */}
          <div className="py-10 lg:py-20 order-last lg:order-none" style={{ transition: "opacity 0.3s", opacity: animating ? 0 : 1 }}>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <SpeechBubbleBadge text={comic.badge || "FEATURED"} />
              <span className="text-[#F5C518]/70 text-sm font-medium uppercase tracking-widest">{comic.genre || 'Action'}</span>
            </div>
            <h1 className="text-white mb-4 leading-none text-center lg:text-left" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 8vw, 96px)", letterSpacing: "0.04em", textShadow: `4px 4px 0 ${comic.accentColor || '#C8181E'}, 8px 8px 0 rgba(0,0,0,0.5)` }}>
              {comic.title}
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto lg:mx-0 text-center lg:text-left leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
              "{comic.tagline || comic.subtitle}"
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button onClick={() => { navigate(comic.ctaLink || `/comic/${comic._id}`) }}
                className="flex items-center gap-2 bg-[#C8181E] text-white px-8 py-4 font-bold border-4 border-black hover:bg-white hover:text-[#C8181E] transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "4px 4px 0 #000" }}>
                <BookOpen size={20} /> {comic.ctaText || 'READ NOW'}
              </button>
              <button onClick={() => navigate("/browse")}
                className="flex items-center gap-2 border-4 border-[#F5C518] text-[#F5C518] px-8 py-4 font-bold hover:bg-[#F5C518] hover:text-black transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "4px 4px 0 #F5C518" }}>
                EXPLORE ALL
              </button>
            </div>
            <div className="flex gap-3 mt-10 justify-center lg:justify-start">
              {localSlides.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-2 transition-all border border-white ${i === idx ? "w-10 bg-[#F5C518] border-[#F5C518]" : "w-2 bg-white/30"}`} />
              ))}
            </div>
          </div>

          <div className="flex justify-center items-end relative order-first lg:order-none mt-10 lg:mt-0 min-h-[auto] lg:min-h-[70vh]">
            <div className="relative" style={{ transition: "opacity 0.3s transform 0.3s", opacity: animating ? 0 : 1 }}>
              <div className="border-8 border-white/30 absolute -inset-4 pointer-events-none" />
              <div
                className="border-4 border-black overflow-hidden w-56 h-80 sm:w-64 sm:h-96 lg:w-[320px] lg:h-[480px]"
                style={{ boxShadow: "12px 12px 0 rgba(0,0,0,0.7)", transform: "rotate(2deg)" }}
              >
                <div className="relative w-full h-full" style={{ background: comic.accentColor || '#C8181E' }}>
                  <img
                    src={comic.img || comic.image}
                    alt={comic.title}
                    className="w-full h-full object-cover"
                  />
                  <HalftoneOverlay opacity={0.06} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${comic.accentColor || '#C8181E'}CC 100%)` }} />
                  <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#C8181E] border-2 border-[#F5C518] flex items-center justify-center">
                        <span style={{ fontFamily: "Bangers, cursive", fontSize: "11px", color: "#FFF" }}>Ls</span>
                      </div>
                      <span className="hidden sm:inline" style={{ fontFamily: "Bangers, cursive", fontSize: "12px", color: "#FFF", letterSpacing: "0.05em" }}>LEKHYAS STUDIO</span>
                    </div>
                    {comic.badge && <Badge text={comic.badge} variant="red" />}
                  </div>
                  <div className="absolute bottom-0 p-4">
                    <p className="text-white font-bold leading-tight" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(18px, 4vw, 22px)", textShadow: "2px 2px 0 #000", letterSpacing: "0.04em" }}>{comic.title}</p>
                    <p className="text-white/80 text-xs mt-1">{comic.genre || 'Action'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => go(-1)} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border-2 border-white/30 text-white items-center justify-center hover:bg-[#C8181E] hover:border-[#C8181E] transition-colors">
        <ChevronLeft size={24} />
      </button>
      <button onClick={() => go(1)} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border-2 border-white/30 text-white items-center justify-center hover:bg-[#C8181E] hover:border-[#C8181E] transition-colors">
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
    </div>
  );
}
