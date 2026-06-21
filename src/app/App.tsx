import { useState, useEffect, useRef } from "react";
import {
  Search, ShoppingCart, User, Menu, X, ChevronLeft, ChevronRight,
  BookOpen, Crown, BarChart3, Settings, ListOrdered, Image, LogOut,
  Plus, Eye, Pencil, Trash2, Star, Zap, Check, ArrowRight, Home,
  Library, BookMarked, HelpCircle, FileText, Lock, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const comics = [
  { id: 1, title: "War-God: Son of Vayu", tagline: "War for Justice", genre: "Mythic Warriors", price: 1449, badge: "HOT", accentColor: "#C8181E", img: "1574375927818-43e50b87e3c4", issues: 3 },
  { id: 2, title: "Jackboy: State Rebel", tagline: "He is really crazy! And he's winning!", genre: "Action-Adventure", price: 1369, badge: "NEW", accentColor: "#1A4FCC", img: "1535090264-6cfaa3e02ade", issues: 2 },
  { id: 3, title: "Gilded Jaguar", tagline: "A forest road life of a jaguar face man", genre: "Action-Adventure", price: 1367, badge: null, accentColor: "#2D7A3A", img: "1508213838-bdef6a3dc4fe", issues: 1 },
  { id: 4, title: "Starveilers: War of the Pearl", tagline: "Team ensemble — April Issue", genre: "Team-Up Sagas", price: 1489, badge: "NEW", accentColor: "#6B2DB5", img: "1511367461989-f85a21fda167", issues: 1 },
  { id: 5, title: "The Second Bhaime", tagline: "War between mens but not man", genre: "Mythic Warriors", price: 1329, badge: null, accentColor: "#8B4A18", img: "1531746020798-e6953c6e8e04", issues: 1 },
  { id: 6, title: "Cowgirl: Justice Rides", tagline: "Hero, villain, or somewhere between?", genre: "Action-Adventure", price: 1249, badge: "BUY & WIN", accentColor: "#B55A0D", img: "1536440136628-849c177e76a1", issues: 2 },
  { id: 7, title: "Surya", tagline: "Not the Original", genre: "Urban Heroes", price: 1499, badge: "HOT", accentColor: "#1A4FCC", img: "1580477667995-2b94f01c9516", issues: 2 },
  { id: 8, title: "Major Mukund", tagline: "Way of Independent", genre: "Urban Heroes", price: 1389, badge: null, accentColor: "#2D6B4F", img: "1507003211169-0a1dd7228f2d", issues: 4 },
  { id: 9, title: "Bineman", tagline: "Silver Heart Creature", genre: "Urban Heroes", price: 1379, badge: "NEW", accentColor: "#1A6B7A", img: "1568702846914-96b305d2aaeb", issues: 1 },
];

const heroSlides = [comics[0], comics[3], comics[6]];

const categories = [
  { name: "Mythic Warriors", icon: "⚔️", desc: "Gods, legends & warrior epics" },
  { name: "Urban Heroes", icon: "🏙️", desc: "Street-level justice in modern India" },
  { name: "Action-Adventure", icon: "🌿", desc: "Outlaws, rebels & frontier tales" },
  { name: "Team-Up Sagas", icon: "🌟", desc: "Ensemble sagas across the universe" },
];

const plans = [
  {
    name: "READER", flavor: "Single Issue Access", price: 149, period: "per issue", features: [
      "Unlimited reading of purchased titles", "HD quality viewing", "Cross-device sync", "Purchase history access"
    ], cta: "Buy Issues", highlight: false, badge: null,
  },
  {
    name: "HERO", flavor: "Monthly Subscriber", price: 399, period: "per month", features: [
      "Access to 5 new titles/month", "Early access (7 days)", "All reader features", "Subscriber-only covers", "Priority support"
    ], cta: "Go Hero", highlight: true, badge: "MOST POPULAR",
  },
  {
    name: "UNIVERSE", flavor: "Full Access", price: 799, period: "per month", features: [
      "Unlimited entire catalog", "Day-one release access", "Exclusive behind-the-scenes", "Creator commentary", "All Hero features", "Physical edition discounts"
    ], cta: "Join Universe", highlight: false, badge: "BEST VALUE",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function HalftoneOverlay({ opacity = 0.06 }: { opacity?: number }) {
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

function Badge({ text, variant = "red" }: { text: string; variant?: "red" | "yellow" | "blue" | "burst" }) {
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

function SpeechBubbleBadge({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <div className="bg-[#F5C518] border-2 border-black px-3 py-1 text-black font-bold text-xs uppercase" style={{ fontFamily: "Bangers, cursive", fontSize: "13px", letterSpacing: "0.05em" }}>
        {text}
      </div>
      <div className="absolute -bottom-2 left-4 w-3 h-3 bg-[#F5C518] border-b-2 border-r-2 border-black" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
    </div>
  );
}

function ComicCard({ comic, onClick }: { comic: typeof comics[0]; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const badgeVariant = comic.badge === "NEW" ? "red" : comic.badge === "HOT" ? "blue" : comic.badge === "BUY & WIN" ? "burst" : "yellow";

  return (
    <div
      className="relative flex-shrink-0 w-44 cursor-pointer group"
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
        <div className="relative" style={{ aspectRatio: "2/3", background: comic.accentColor }}>
          <img
            src={`https://images.unsplash.com/photo-${comic.img}?w=300&h=450&fit=crop&auto=format`}
            alt={comic.title}
            className="w-full h-full object-cover mix-blend-overlay opacity-70"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${comic.accentColor} 100%)` }} />
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
          <p className="text-xs text-[#6B5B45] font-medium">{comic.genre}</p>
          <p className="font-bold text-black" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>₹{comic.price.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────

function NavBar({ currentPage, setPage }: { currentPage: string; setPage: (p: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Browse", page: "browse" },
    { label: "Universe", page: "browse" },
    { label: "Plans", page: "plans" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D] border-b-4 border-[#C8181E]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#C8181E] border-3 border-[#F5C518] flex items-center justify-center flex-shrink-0" style={{ border: "3px solid #F5C518" }}>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "18px", color: "#FFFFFF", letterSpacing: "0.02em" }}>Ls</span>
            </div>
            <div className="hidden sm:block">
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.08em", color: "#FFFFFF" }}>LEKHYAS</span>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.08em", color: "#F5C518" }}> STUDIO</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => setPage(l.page)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${currentPage === l.page ? "text-[#F5C518]" : "text-white hover:text-[#F5C518]"}`}
                style={{ fontFamily: "Bangers, cursive", fontSize: "16px", letterSpacing: "0.06em" }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-white hover:text-[#F5C518] transition-colors"><Search size={20} /></button>
            <button className="p-2 text-white hover:text-[#F5C518] transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8181E] rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
            </button>
            <button onClick={() => setPage("library")} className="p-2 text-white hover:text-[#F5C518] transition-colors"><Library size={20} /></button>
            <button onClick={() => setPage("login")} className="hidden sm:flex items-center gap-1 bg-[#C8181E] border-2 border-[#C8181E] hover:bg-white hover:text-[#C8181E] text-white px-3 py-1 text-sm font-bold transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
              <User size={14} /> LOGIN
            </button>
            <button onClick={() => setPage("admin")} className="hidden sm:flex items-center gap-1 border-2 border-[#F5C518] text-[#F5C518] hover:bg-[#F5C518] hover:text-black px-3 py-1 text-sm font-bold transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
              ADMIN
            </button>
            <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t-2 border-[#333] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => { setPage(l.page); setMobileOpen(false); }}
              className="text-left px-2 py-2 text-white hover:text-[#F5C518] font-bold uppercase tracking-wider text-sm"
              style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>
              {l.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setPage("login"); setMobileOpen(false); }} className="flex-1 bg-[#C8181E] text-white py-2 text-center font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>LOGIN</button>
            <button onClick={() => { setPage("admin"); setMobileOpen(false); }} className="flex-1 border-2 border-[#F5C518] text-[#F5C518] py-2 text-center font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>ADMIN</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroSection({ setPage }: { setPage: (p: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIdx((i) => (i + dir + heroSlides.length) % heroSlides.length);
      setAnimating(false);
    }, 250);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [idx]);

  const comic = heroSlides[idx];

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "92vh", background: "#0D0D0D" }}>
      <HalftoneOverlay opacity={0.12} />

      {/* Background art */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: animating ? 0 : 1 }}>
        <img
          src={`https://images.unsplash.com/photo-${comic.img}?w=1400&h=900&fit=crop&auto=format`}
          alt={comic.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.25, mixBlendMode: "luminosity" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${comic.accentColor}CC 0%, #0D0D0D 60%)` }} />
      </div>

      {/* Panel border overlay — comic frame lines */}
      <div className="absolute inset-4 border-4 border-white/10 pointer-events-none" />
      <div className="absolute inset-2 border border-white/5 pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 flex items-center" style={{ minHeight: "92vh" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          {/* Text side */}
          <div className="py-20" style={{ transition: "opacity 0.3s", opacity: animating ? 0 : 1 }}>
            <div className="flex items-center gap-3 mb-6">
              <SpeechBubbleBadge text={comic.badge || "FEATURED"} />
              <span className="text-[#F5C518]/70 text-sm font-medium uppercase tracking-widest">{comic.genre}</span>
            </div>
            <h1 className="text-white mb-4 leading-none" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(56px, 8vw, 96px)", letterSpacing: "0.04em", textShadow: `4px 4px 0 ${comic.accentColor}, 8px 8px 0 rgba(0,0,0,0.5)` }}>
              {comic.title}
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
              "{comic.tagline}"
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setPage("detail")}
                className="flex items-center gap-2 bg-[#C8181E] text-white px-8 py-4 font-bold border-4 border-black hover:bg-white hover:text-[#C8181E] transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "4px 4px 0 #000" }}>
                <BookOpen size={20} /> READ NOW
              </button>
              <button onClick={() => setPage("browse")}
                className="flex items-center gap-2 border-4 border-[#F5C518] text-[#F5C518] px-8 py-4 font-bold hover:bg-[#F5C518] hover:text-black transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "4px 4px 0 #F5C518" }}>
                EXPLORE ALL
              </button>
            </div>
            {/* Slide dots */}
            <div className="flex gap-3 mt-10">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-2 transition-all border border-white ${i === idx ? "w-10 bg-[#F5C518] border-[#F5C518]" : "w-2 bg-white/30"}`} />
              ))}
            </div>
          </div>

          {/* Comic cover side — "breaking out of panel" */}
          <div className="hidden lg:flex justify-center items-end relative" style={{ minHeight: "70vh" }}>
            <div className="relative" style={{ transition: "opacity 0.3s transform 0.3s", opacity: animating ? 0 : 1 }}>
              {/* Panel border */}
              <div className="border-8 border-white/30 absolute -inset-4 pointer-events-none" />
              <div
                className="border-4 border-black overflow-hidden"
                style={{ width: 320, height: 480, boxShadow: "12px 12px 0 rgba(0,0,0,0.7)", transform: "rotate(2deg)" }}
              >
                <div className="relative w-full h-full" style={{ background: comic.accentColor }}>
                  <img
                    src={`https://images.unsplash.com/photo-${comic.img}?w=400&h=600&fit=crop&auto=format`}
                    alt={comic.title}
                    className="w-full h-full object-cover"
                  />
                  <HalftoneOverlay opacity={0.06} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${comic.accentColor}CC 100%)` }} />
                  <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#C8181E] border-2 border-[#F5C518] flex items-center justify-center">
                        <span style={{ fontFamily: "Bangers, cursive", fontSize: "11px", color: "#FFF" }}>Ls</span>
                      </div>
                      <span style={{ fontFamily: "Bangers, cursive", fontSize: "12px", color: "#FFF", letterSpacing: "0.05em" }}>LEKHYAS STUDIO</span>
                    </div>
                    {comic.badge && <Badge text={comic.badge} variant="red" />}
                  </div>
                  <div className="absolute bottom-0 p-4">
                    <p className="text-white font-bold leading-tight" style={{ fontFamily: "Bangers, cursive", fontSize: "22px", textShadow: "2px 2px 0 #000", letterSpacing: "0.04em" }}>{comic.title}</p>
                    <p className="text-white/80 text-xs mt-1">{comic.genre}</p>
                  </div>
                </div>
              </div>
              {/* Price sticker */}
              <div className="absolute -bottom-4 -right-4 bg-[#F5C518] border-4 border-black px-4 py-2 rotate-6 z-10">
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.04em" }}>₹{comic.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arrow nav */}
        <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border-2 border-white/30 text-white flex items-center justify-center hover:bg-[#C8181E] hover:border-[#C8181E] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 border-2 border-white/30 text-white flex items-center justify-center hover:bg-[#C8181E] hover:border-[#C8181E] transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Diagonal bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
    </div>
  );
}

// ─── Comic Row ─────────────────────────────────────────────────────────────

function ComicRow({ title, badge, comics: rowComics, setPage }: { title: string; badge?: string; comics: typeof comics; setPage: (p: string) => void }) {
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
            <button onClick={() => setPage("browse")} className="ml-2 text-[#C8181E] font-bold text-sm flex items-center gap-1 hover:text-[#0D0D0D] transition-colors" style={{ fontFamily: "DM Sans, sans-serif" }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Divider — comic chapter rule */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1 bg-[#0D0D0D]" />
          <div className="w-3 h-3 bg-[#C8181E] rotate-45" />
          <div className="flex-1 h-0.5 bg-[#0D0D0D]/30" />
        </div>

        <div ref={ref} className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {rowComics.map((c) => <ComicCard key={c.id} comic={c} onClick={() => setPage("detail")} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Homepage ──────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const newArrivals = comics.filter(c => c.badge === "NEW" || c.badge === "HOT");
  const grouped = categories.map(cat => ({ ...cat, items: comics.filter(c => c.genre === cat.name) }));

  return (
    <div>
      <HeroSection setPage={setPage} />

      {/* New Arrivals */}
      <div className="bg-[#F4EFE0] relative">
        <HalftoneOverlay opacity={0.03} />
        <ComicRow title="NEW ARRIVALS" badge="NEW" comics={newArrivals} setPage={setPage} />
      </div>

      {/* Category Rows */}
      {grouped.map((cat, i) => (
        <div key={cat.name} className={`relative ${i % 2 === 1 ? "bg-[#0D0D0D]" : "bg-[#F4EFE0]"}`}>
          <HalftoneOverlay opacity={i % 2 === 1 ? 0.15 : 0.03} />
          {i % 2 === 1 && (
            // Dark section category header
            <div className="max-w-7xl mx-auto px-4 pt-10">
              <div className="inline-flex items-center gap-3 bg-[#C8181E] border-4 border-black px-6 py-3 -skew-x-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-white font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.05em" }}>{cat.desc}</span>
              </div>
            </div>
          )}
          <div className={i % 2 === 1 ? "[&_h2]:text-white [&_.divider-dot]:bg-[#F5C518] [&_.divider-line]:bg-white [&_.view-all]:text-[#F5C518] [&_.card-genre]:text-[#ccc]" : ""}>
            <ComicRow title={cat.name} comics={cat.items.length > 0 ? cat.items : comics.slice(0, 4)} setPage={setPage} />
          </div>
        </div>
      ))}

      {/* Subscription Banner */}
      <div className="relative overflow-hidden" style={{ background: "#C8181E" }}>
        <HalftoneOverlay opacity={0.1} />
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <Badge text="UNLIMITED ACCESS" variant="yellow" />
          <h2 className="text-white mt-4 mb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(48px, 6vw, 72px)", letterSpacing: "0.04em", textShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
            READ THE ENTIRE LEKHYAS UNIVERSE
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Subscribe and get unlimited access to all 9+ titles — new issues every month. Starting at just ₹399/month.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setPage("plans")}
              className="bg-[#F5C518] text-black px-10 py-4 font-bold border-4 border-black hover:bg-white transition-colors"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.05em", boxShadow: "5px 5px 0 #000" }}>
              <Crown size={20} className="inline mr-2" /> SEE ALL PLANS
            </button>
            <button onClick={() => setPage("browse")}
              className="border-4 border-white text-white px-10 py-4 font-bold hover:bg-white hover:text-[#C8181E] transition-colors"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.05em" }}>
              BROWSE FREE SAMPLES
            </button>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Browse ────────────────────────────────────────────────────────────────

function BrowsePage({ setPage }: { setPage: (p: string) => void }) {
  const [activeGenre, setActiveGenre] = useState("All");
  const [sort, setSort] = useState("New");
  const genres = ["All", ...categories.map(c => c.name)];
  const filtered = activeGenre === "All" ? comics : comics.filter(c => c.genre === activeGenre);
  const sorted = [...filtered].sort((a, b) => sort === "Price ↑" ? a.price - b.price : sort === "Price ↓" ? b.price - a.price : 0);

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-14 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(48px, 7vw, 80px)", letterSpacing: "0.05em", textShadow: "4px 4px 0 #C8181E" }}>
            BROWSE THE UNIVERSE
          </h1>
          <p className="text-white/60 mt-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {comics.length} titles in the Lekhyas Universe
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-8 border-b-4 border-black pb-6">
          <div className="flex flex-wrap gap-2 flex-1">
            {genres.map(g => (
              <button key={g} onClick={() => setActiveGenre(g)}
                className={`px-4 py-1.5 border-2 border-black font-bold text-sm transition-colors ${activeGenre === g ? "bg-[#C8181E] text-white border-[#C8181E]" : "bg-white text-black hover:bg-[#F5C518]"}`}
                style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
                {g}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="border-2 border-black bg-white px-3 py-2 text-sm font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {["New", "Price ↑", "Price ↓"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sorted.map(c => <ComicCard key={c.id} comic={c} onClick={() => setPage("detail")} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Comic Detail ──────────────────────────────────────────────────────────

function ComicDetailPage({ setPage }: { setPage: (p: string) => void }) {
  const comic = comics[0]; // War-God: Son of Vayu
  const related = comics.slice(3, 7);

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Cover */}
          <div className="lg:col-span-2">
            <div className="relative border-4 border-black overflow-hidden" style={{ boxShadow: "10px 10px 0 #0D0D0D", maxWidth: 380 }}>
              <div className="relative" style={{ aspectRatio: "2/3", background: comic.accentColor }}>
                <img src={`https://images.unsplash.com/photo-${comic.img}?w=500&h=750&fit=crop&auto=format`} alt={comic.title} className="w-full h-full object-cover" />
                <HalftoneOverlay opacity={0.06} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${comic.accentColor}CC 100%)` }} />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C8181E] border-2 border-[#F5C518] flex items-center justify-center">
                    <span style={{ fontFamily: "Bangers, cursive", fontSize: "13px", color: "#FFF" }}>Ls</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge text={comic.badge || "FEATURED"} variant="red" />
                </div>
                <div className="absolute bottom-0 p-4">
                  <p className="text-white font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "24px", textShadow: "2px 2px 0 #000", letterSpacing: "0.04em" }}>{comic.title}</p>
                </div>
              </div>
            </div>
            {/* Preview strip */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-2">Preview Pages</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="w-16 h-24 border-2 border-black overflow-hidden bg-[#888] relative cursor-pointer hover:opacity-80">
                    <img src={`https://images.unsplash.com/photo-${comic.img}?w=80&h=120&fit=crop&auto=format&crop=entropy&_seed=${n}`} alt={`Page ${n}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white text-xs font-bold">{n}</span>
                    </div>
                  </div>
                ))}
                <div className="w-16 h-24 border-2 border-dashed border-black flex items-center justify-center bg-[#E8E0CC] cursor-pointer hover:bg-[#F5C518] transition-colors" onClick={() => setPage("reader")}>
                  <span className="text-xs font-bold text-center leading-tight px-1">Read More</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge text={comic.genre} variant="blue" />
              <Badge text="3 Issues" variant="yellow" />
              <Badge text="All Ages" variant="yellow" />
            </div>
            <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 5vw, 60px)", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              {comic.title}
            </h1>
            <p className="text-[#6B5B45] text-lg mt-1 mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>"{comic.tagline}"</p>

            <div className="border-4 border-black bg-white p-5 mb-6" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif", color: "#2A2A2A" }}>
                In a world where ancient gods and modern chaos collide, the Son of Vayu — god of wind — rises as the last defender of justice across three epic issues. Born of myth, forged in battle, War-God must protect the Lekhyas Universe from a darkness that predates creation itself.
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-black/10 text-sm text-[#6B5B45]">
                <span><strong>Creator:</strong> Lekhyas Studio</span>
                <span><strong>Issues:</strong> March, June, Sep</span>
                <span><strong>Pages:</strong> 48 avg</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-1">Single Issue Price</p>
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "48px", lineHeight: 1, color: "#0D0D0D" }}>₹{comic.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="border-l-2 border-black/20 pl-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-1">Or subscribe from</p>
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "28px", lineHeight: 1, color: "#C8181E" }}>₹399<span className="text-base">/mo</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => setPage("checkout")}
                className="flex items-center gap-2 bg-[#C8181E] text-white px-8 py-4 font-bold border-4 border-black hover:bg-[#0D0D0D] transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em", boxShadow: "4px 4px 0 #000" }}>
                <ShoppingCart size={18} /> BUY & READ
              </button>
              <button onClick={() => setPage("plans")}
                className="flex items-center gap-2 border-4 border-[#1A4FCC] text-[#1A4FCC] px-8 py-4 font-bold hover:bg-[#1A4FCC] hover:text-white transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em" }}>
                <Crown size={18} /> READ WITH PLAN
              </button>
              <button onClick={() => setPage("reader")}
                className="flex items-center gap-2 border-4 border-black text-black px-6 py-4 font-bold hover:bg-[#F5C518] transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.04em" }}>
                <Eye size={18} /> FREE SAMPLE
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-xs text-[#6B5B45] font-medium border-t-2 border-black/10 pt-4">
              <span className="flex items-center gap-1"><Lock size={12} /> Secure Payment</span>
              <span className="flex items-center gap-1"><BookOpen size={12} /> Online Read Only</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Instant Access</span>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em" }}>YOU MIGHT ALSO LIKE</h2>
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {related.map(c => <ComicCard key={c.id} comic={c} onClick={() => setPage("detail")} />)}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Reader ────────────────────────────────────────────────────────────────

function ReaderPage({ setPage }: { setPage: (p: string) => void }) {
  const [page, setPageNum] = useState(1);
  const [barVisible, setBarVisible] = useState(true);
  const total = 12;
  const imgIds = ["1574375927818-43e50b87e3c4", "1535090264-6cfaa3e02ade", "1508213838-bdef6a3dc4fe"];

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-6 py-3 bg-[#0D0D0D] border-b-2 border-[#222] transition-opacity duration-300 ${barVisible ? "opacity-100" : "opacity-0"}`}
        style={{ zIndex: 10 }}
      >
        <button onClick={() => setPage("detail")} className="flex items-center gap-2 text-[#F5C518] hover:text-white transition-colors font-bold text-sm">
          <ChevronLeft size={16} /> BACK
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm" style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.05em" }}>WAR-GOD: SON OF VAYU</p>
          <p className="text-white/50 text-xs">Issue #1 — March</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm">{page} / {total}</span>
          <button onClick={() => setBarVisible(!barVisible)} className="text-white/40 hover:text-white transition-colors text-xs font-bold">
            {barVisible ? "HIDE" : "SHOW"} UI
          </button>
        </div>
      </div>

      {/* Page display */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={() => setBarVisible(!barVisible)}>
        <div className="relative" style={{ maxHeight: "calc(100vh - 130px)", aspectRatio: "2/3", position: "relative" }}>
          <div className="w-full h-full border-4 border-[#222] overflow-hidden" style={{ maxHeight: "calc(100vh - 130px)", maxWidth: "calc((100vh - 130px) * 2/3)" }}>
            <img
              src={`https://images.unsplash.com/photo-${imgIds[(page - 1) % imgIds.length]}?w=600&h=900&fit=crop&auto=format`}
              alt={`Page ${page}`}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white/[0.03] font-bold select-none" style={{ fontFamily: "Bangers, cursive", fontSize: "80px", transform: "rotate(-35deg)", letterSpacing: "0.1em" }}>
                LEKHYAS STUDIO
              </div>
            </div>
            {/* Page number corner */}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "14px" }}>
              {page}
            </div>
          </div>
        </div>

        {/* Side nav */}
        <button onClick={(e) => { e.stopPropagation(); if (page > 1) setPageNum(p => p - 1); }}
          disabled={page <= 1}
          className="absolute left-4 w-12 h-12 bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8181E] disabled:opacity-20 transition-colors">
          <ChevronLeft size={22} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); if (page < total) setPageNum(p => p + 1); }}
          disabled={page >= total}
          className="absolute right-4 w-12 h-12 bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8181E] disabled:opacity-20 transition-colors">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className={`bg-[#0D0D0D] border-t-2 border-[#222] px-4 py-3 transition-opacity duration-300 ${barVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button onClick={() => setPageNum(1)} className="text-white/50 hover:text-white text-xs font-bold transition-colors">FIRST</button>
          <div className="flex-1 relative h-2 bg-[#222] rounded-none cursor-pointer" onClick={e => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setPageNum(Math.max(1, Math.min(total, Math.round(pct * total))));
          }}>
            <div className="h-full bg-[#C8181E] transition-all" style={{ width: `${(page / total) * 100}%` }} />
          </div>
          <button onClick={() => setPageNum(total)} className="text-white/50 hover:text-white text-xs font-bold transition-colors">LAST</button>
        </div>
        {/* Thumbnail strip */}
        <div className="flex gap-1 justify-center mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setPageNum(i + 1)}
              className={`flex-shrink-0 w-8 h-10 border transition-colors overflow-hidden ${page === i + 1 ? "border-[#C8181E]" : "border-[#333] hover:border-[#666]"}`}>
              <img src={`https://images.unsplash.com/photo-${imgIds[i % imgIds.length]}?w=32&h=40&fit=crop&auto=format`} alt={`${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Plans ─────────────────────────────────────────────────────────────────

function PlansPage({ setPage }: { setPage: (p: string) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes — cancel before your next billing date and you keep access until the end of the period. No questions asked." },
    { q: "Can I still buy single issues without a plan?", a: "Absolutely. Single-purchase and subscription access coexist — buy any title individually at any time." },
    { q: "Are comics downloadable?", a: "No. All reading happens in-browser only. This protects creator work and your subscription value." },
    { q: "How does billing work?", a: "All billing is handled securely via Razorpay. We accept major cards and UPI." },
    { q: "Is there a free trial?", a: "Each title has free sample pages — no sign-up needed. Full subscription trials are offered during launch promotions." },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-16 text-center overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="relative">
          <Badge text="CHOOSE YOUR POWER LEVEL" variant="yellow" />
          <h1 className="text-white mt-4" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(48px, 7vw, 80px)", letterSpacing: "0.05em", textShadow: "4px 4px 0 #C8181E" }}>
            MEMBERSHIP PLANS
          </h1>
          <p className="text-white/60 mt-2 text-lg" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Join the Lekhyas Universe. Read everything. Cancel anytime.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={plan.name} className="relative">
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className={`px-4 py-1 border-2 border-black font-bold text-sm ${plan.highlight ? "bg-[#F5C518] text-black" : "bg-[#1A4FCC] text-white"}`}
                    style={{ fontFamily: "Bangers, cursive", fontSize: "14px", letterSpacing: "0.04em" }}>
                    ★ {plan.badge}
                  </div>
                </div>
              )}
              <div
                className={`border-4 border-black h-full flex flex-col transition-transform hover:-translate-y-1 ${plan.highlight ? "bg-[#0D0D0D] text-white" : "bg-white text-[#0D0D0D]"}`}
                style={{ boxShadow: plan.highlight ? "6px 6px 0 #C8181E" : "6px 6px 0 #0D0D0D" }}
              >
                <div className={`p-6 border-b-4 border-black ${plan.highlight ? "bg-[#C8181E]" : "bg-[#F4EFE0]"}`}>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70" style={{ fontFamily: "DM Sans, sans-serif" }}>{plan.flavor}</p>
                  <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.06em", lineHeight: 1, color: plan.highlight ? "#FFF" : "#0D0D0D" }}>
                    {plan.name}
                  </h2>
                  <div className="mt-3">
                    <span style={{ fontFamily: "Bangers, cursive", fontSize: "52px", lineHeight: 1, color: plan.highlight ? "#F5C518" : "#C8181E" }}>₹{plan.price}</span>
                    <span className="text-sm opacity-60 ml-1">{plan.period}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-[#F5C518]" : "text-[#2D9E4F]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPage("checkout")}
                    className={`mt-6 w-full py-4 font-bold border-2 border-black transition-colors ${plan.highlight ? "bg-[#F5C518] text-black hover:bg-white" : "bg-[#C8181E] text-white hover:bg-[#0D0D0D]"}`}
                    style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em" }}>
                    {plan.cta} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.05em" }}>FREQUENTLY ASKED</h2>
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
          </div>
          <div className="space-y-2 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="border-4 border-black bg-white overflow-hidden" style={{ boxShadow: openFaq === i ? "4px 4px 0 #C8181E" : "2px 2px 0 #0D0D0D" }}>
                <button className="w-full flex items-center justify-between p-4 font-bold text-left" style={{ fontFamily: "DM Sans, sans-serif" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-[#6B5B45] border-t-2 border-black/10 pt-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Checkout ──────────────────────────────────────────────────────────────

function CheckoutPage({ setPage }: { setPage: (p: string) => void }) {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-[#2D9E4F] border-4 border-black flex items-center justify-center mx-auto mb-6" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
            <Check size={36} className="text-white" strokeWidth={3} />
          </div>
          <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "48px", letterSpacing: "0.05em" }}>PAYMENT SUCCESS!</h1>
          <p className="text-[#6B5B45] mt-2 mb-8" style={{ fontFamily: "DM Sans, sans-serif" }}>
            War-God: Son of Vayu has been added to your library. Start reading right now!
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setPage("reader")}
              className="bg-[#C8181E] text-white py-4 font-bold border-4 border-black hover:bg-[#0D0D0D] transition-colors"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.04em", boxShadow: "4px 4px 0 #000" }}>
              <BookOpen size={18} className="inline mr-2" /> READ NOW
            </button>
            <button onClick={() => setPage("library")} className="border-4 border-black py-3 font-bold hover:bg-[#F5C518] transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>
              GO TO MY LIBRARY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "52px", letterSpacing: "0.05em" }}>CHECKOUT</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-6">
          {/* Order summary */}
          <div className="md:col-span-3">
            <div className="border-4 border-black bg-white p-6 mb-4" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <h2 className="font-bold text-lg mb-4 border-b-2 border-black/10 pb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "24px", letterSpacing: "0.04em" }}>ORDER SUMMARY</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-24 border-2 border-black overflow-hidden flex-shrink-0" style={{ background: "#C8181E" }}>
                  <img src={`https://images.unsplash.com/photo-${comics[0].img}?w=80&h=120&fit=crop&auto=format`} alt={comics[0].title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>War-God: Son of Vayu</p>
                  <p className="text-sm text-[#6B5B45]">Issue #1 — March</p>
                  <Badge text="Online Read Only" variant="blue" />
                </div>
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "22px" }}>₹1,449</p>
              </div>
              <div className="border-t-2 border-black/10 mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>₹1,449</span>
              </div>
            </div>
            {/* Trust */}
            <div className="flex flex-wrap gap-4 text-xs text-[#6B5B45] font-medium">
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><Lock size={12} /> Secured by Razorpay</span>
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><BookOpen size={12} /> No downloads — online read only</span>
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><Zap size={12} /> Instant access after payment</span>
            </div>
          </div>
          {/* Payment */}
          <div className="md:col-span-2">
            <div className="border-4 border-black bg-white p-6" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <h2 className="font-bold mb-4 border-b-2 border-black/10 pb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.04em" }}>PAYMENT</h2>
              <div className="space-y-3 mb-6">
                {[{ label: "Email / Phone", type: "email", placeholder: "you@example.com" }, { label: "Name", type: "text", placeholder: "Your name" }].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="w-full border-2 border-black px-3 py-2 text-sm bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E]" style={{ fontFamily: "DM Sans, sans-serif" }} />
                  </div>
                ))}
              </div>
              <button onClick={() => setConfirmed(true)}
                className="w-full bg-[#1A4FCC] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em", boxShadow: "3px 3px 0 #000" }}>
                PAY ₹1,449 via RAZORPAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Library ───────────────────────────────────────────────────────────────

function LibraryPage({ setPage }: { setPage: (p: string) => void }) {
  const [tab, setTab] = useState("Purchased");
  const tabs = ["Purchased", "Subscription", "Reading History"];
  const myComics = comics.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-12 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-7xl mx-auto px-6 relative flex items-end justify-between">
          <div>
            <p className="text-[#F5C518] text-sm font-bold uppercase tracking-widest mb-1">Welcome back, Reader</p>
            <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 5vw, 60px)", letterSpacing: "0.05em" }}>MY COMICS</h1>
          </div>
          <div className="hidden sm:flex gap-2">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 border-2 font-bold text-sm transition-colors ${tab === t ? "bg-[#C8181E] border-[#C8181E] text-white" : "border-white/30 text-white/60 hover:text-white hover:border-white"}`}
                style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {myComics.map(c => (
            <div key={c.id} className="relative">
              <ComicCard comic={c} onClick={() => setPage("reader")} />
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-[#6B5B45] mb-1">
                  <span>Page 12/48</span>
                  <span>25%</span>
                </div>
                <div className="h-1.5 bg-[#E8E0CC] border border-black">
                  <div className="h-full bg-[#C8181E]" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────

function LoginPage({ setPage }: { setPage: (p: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen pt-16 grid grid-cols-1 lg:grid-cols-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Art side */}
      <div className="hidden lg:block relative bg-[#0D0D0D] overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <img src={`https://images.unsplash.com/photo-${comics[0].img}?w=800&h=1000&fit=crop&auto=format`} alt="Comic art" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #C8181E66 0%, #0D0D0D 70%)" }} />
        <div className="relative h-full flex flex-col justify-end p-12">
          <div className="mb-6">
            <div className="w-14 h-14 rounded-full bg-[#C8181E] border-3 border-[#F5C518] flex items-center justify-center mb-4" style={{ border: "3px solid #F5C518" }}>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "24px", color: "#FFF" }}>Ls</span>
            </div>
            <h2 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "48px", letterSpacing: "0.04em" }}>LEKHYAS STUDIO</h2>
            <p className="text-white/60 mt-2 text-lg">The Lekhyas Universe awaits. 9 titles. Real heroes. Indian mythology meets modern action.</p>
          </div>
          <div className="flex gap-3">
            {["HOT", "NEW", "BUY & WIN"].map(b => <Badge key={b} text={b} variant={b === "NEW" ? "red" : b === "HOT" ? "blue" : "yellow"} />)}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="bg-[#F4EFE0] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="border-4 border-black bg-white p-8" style={{ boxShadow: "8px 8px 0 #0D0D0D" }}>
            <div className="flex mb-6 border-b-4 border-black">
              {(["login", "signup"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-3 font-bold uppercase tracking-wider text-sm transition-colors ${mode === m ? "bg-[#C8181E] text-white" : "bg-transparent text-[#6B5B45] hover:text-[#0D0D0D]"}`}
                  style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.06em" }}>
                  {m === "login" ? "LOGIN" : "SIGN UP"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Full Name</label>
                  <input type="text" placeholder="Your name" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Email / Phone</label>
                <input type="email" placeholder="you@example.com" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" />
              </div>
              {mode === "login" && (
                <div className="text-right">
                  <button className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] transition-colors">Forgot password?</button>
                </div>
              )}
              <button className="w-full bg-[#C8181E] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors mt-2"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em", boxShadow: "3px 3px 0 #000" }}>
                {mode === "login" ? "ENTER THE UNIVERSE" : "CREATE ACCOUNT"}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-black/15" />
                <span className="text-xs text-[#6B5B45] font-bold">OR</span>
                <div className="flex-1 h-px bg-black/15" />
              </div>
              <button className="w-full border-2 border-black py-3 font-bold text-sm hover:bg-[#F5C518] transition-colors" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Continue with Google
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-[#6B5B45] mt-4">
            By continuing, you agree to the <button onClick={() => setPage("terms")} className="underline hover:text-[#C8181E]">Terms & Conditions</button> and <button onClick={() => setPage("privacy")} className="underline hover:text-[#C8181E]">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin ─────────────────────────────────────────────────────────────────

function AdminPanel({ setPage }: { setPage: (p: string) => void }) {
  const [adminPage, setAdminPage] = useState("dashboard");

  const navItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "comics", icon: BookMarked, label: "Manage Comics" },
    { id: "categories", icon: ListOrdered, label: "Categories" },
    { id: "plans", icon: Crown, label: "Sub Plans" },
    { id: "orders", icon: ShoppingCart, label: "Orders & Sales" },
    { id: "hero", icon: Image, label: "Hero Manager" },
    { id: "settings", icon: Settings, label: "Site Settings" },
  ];

  const kpis = [
    { label: "Total Revenue", value: "₹2,84,700", sub: "+18% this month", color: "#2D9E4F" },
    { label: "Active Subscribers", value: "342", sub: "+24 this week", color: "#1A4FCC" },
    { label: "Comics Published", value: "9", sub: "3 drafts pending", color: "#C8181E" },
    { label: "New Orders", value: "67", sub: "Last 7 days", color: "#8B2DB5" },
  ];

  const recentOrders = [
    { id: "#4201", customer: "Arjun M.", item: "War-God: Son of Vayu", amount: "₹1,449", status: "Paid", date: "21 Jun 2026" },
    { id: "#4200", customer: "Priya K.", item: "HERO Plan — Monthly", amount: "₹399", status: "Paid", date: "21 Jun 2026" },
    { id: "#4199", customer: "Rahul S.", item: "Starveilers: War of the Pearl", amount: "₹1,489", status: "Paid", date: "20 Jun 2026" },
    { id: "#4198", customer: "Meera T.", item: "UNIVERSE Plan", amount: "₹799", status: "Paid", date: "20 Jun 2026" },
    { id: "#4197", customer: "Dev P.", item: "Jackboy: State Rebel", amount: "₹1,369", status: "Pending", date: "19 Jun 2026" },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-16 flex" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Sidebar */}
      <div className="w-64 bg-[#0D0D0D] flex-shrink-0 flex flex-col min-h-screen border-r-4 border-[#C8181E]" style={{ position: "sticky", top: 64, height: "calc(100vh - 64px)", overflowY: "auto" }}>
        <div className="p-6 border-b border-white/10">
          <p className="text-[#F5C518] text-xs font-bold uppercase tracking-widest">Admin Panel</p>
          <p className="text-white font-bold mt-1" style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em" }}>LEKHYAS STUDIO</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setAdminPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${adminPage === item.id ? "bg-[#C8181E] text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => setPage("home")} className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm transition-colors">
            <LogOut size={16} /> Back to Site
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {adminPage === "dashboard" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.04em" }}>DASHBOARD</h1>
                <p className="text-[#6B5B45] text-sm">Saturday, 21 June 2026</p>
              </div>
              <button className="flex items-center gap-2 bg-[#C8181E] text-white px-4 py-2 border-2 border-black font-bold text-sm hover:bg-[#0D0D0D] transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>
                <Plus size={14} /> ADD COMIC
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpis.map(k => (
                <div key={k.label} className="border-4 border-black bg-white p-5" style={{ boxShadow: `4px 4px 0 ${k.color}` }}>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-2">{k.label}</p>
                  <p className="font-bold text-[#0D0D0D]" style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.02em" }}>{k.value}</p>
                  <p className="text-xs text-[#6B5B45] mt-1">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="border-4 border-black bg-white" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <div className="flex items-center justify-between p-5 border-b-4 border-black">
                <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.04em" }}>RECENT ORDERS</h2>
                <button onClick={() => setAdminPage("orders")} className="text-xs text-[#C8181E] font-bold hover:text-[#0D0D0D] flex items-center gap-1">
                  View All <ArrowRight size={12} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black/10 bg-[#F4EFE0]">
                      {["Order", "Customer", "Item", "Amount", "Status", "Date"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6B5B45]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o, i) => (
                      <tr key={o.id} className={`border-b border-black/5 ${i % 2 === 0 ? "" : "bg-[#F9F7F2]"}`}>
                        <td className="px-5 py-4 font-bold text-[#C8181E]">{o.id}</td>
                        <td className="px-5 py-4">{o.customer}</td>
                        <td className="px-5 py-4 text-[#6B5B45]">{o.item}</td>
                        <td className="px-5 py-4 font-bold">{o.amount}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 text-xs font-bold border ${o.status === "Paid" ? "border-[#2D9E4F] text-[#2D9E4F] bg-[#2D9E4F]/10" : "border-[#F5C518] text-[#8B5A00] bg-[#F5C518]/20"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#6B5B45]">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminPage === "comics" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.04em" }}>MANAGE COMICS</h1>
              <button className="flex items-center gap-2 bg-[#C8181E] text-white px-4 py-2 border-2 border-black font-bold text-sm hover:bg-[#0D0D0D] transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>
                <Plus size={14} /> ADD NEW COMIC
              </button>
            </div>
            <div className="border-4 border-black bg-white" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-4 border-black bg-[#0D0D0D] text-white">
                    {["Cover", "Title", "Genre", "Issues", "Price", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comics.map((c, i) => (
                    <tr key={c.id} className={`border-b border-black/10 ${i % 2 === 0 ? "" : "bg-[#F9F7F2]"}`}>
                      <td className="px-4 py-3">
                        <div className="w-10 h-14 border-2 border-black overflow-hidden" style={{ background: c.accentColor }}>
                          <img src={`https://images.unsplash.com/photo-${c.img}?w=40&h=56&fit=crop&auto=format`} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold">{c.title}</td>
                      <td className="px-4 py-3 text-[#6B5B45]">{c.genre}</td>
                      <td className="px-4 py-3">{c.issues}</td>
                      <td className="px-4 py-3 font-bold">₹{c.price.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs font-bold border border-[#2D9E4F] text-[#2D9E4F] bg-[#2D9E4F]/10">Published</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 border border-black/20 hover:bg-[#F5C518] transition-colors"><Pencil size={14} /></button>
                          <button className="p-1.5 border border-black/20 hover:bg-[#C8181E] hover:text-white transition-colors"><Trash2 size={14} /></button>
                          <button className="p-1.5 border border-black/20 hover:bg-[#1A4FCC] hover:text-white transition-colors"><Eye size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!["dashboard", "comics"].includes(adminPage) && (
          <div className="p-8 flex items-center justify-center" style={{ minHeight: "60vh" }}>
            <div className="text-center border-4 border-black bg-white p-12" style={{ boxShadow: "6px 6px 0 #C8181E" }}>
              <p style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.04em" }}>{navItems.find(n => n.id === adminPage)?.label}</p>
              <p className="text-[#6B5B45] mt-2 text-sm">This admin panel section is ready for implementation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Simple Pages ──────────────────────────────────────────────────────────

function SimplePage({ title, setPage }: { title: string; setPage: (p: string) => void }) {
  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-14 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-4xl mx-auto px-6 relative">
          <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 6vw, 68px)", letterSpacing: "0.05em", textShadow: "3px 3px 0 #C8181E" }}>{title}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="border-4 border-black bg-white p-8" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
          {title === "Contact Us" ? (
            <div className="space-y-4">
              <p className="font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>GET IN TOUCH</p>
              {["Name", "Email", "Subject"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">{f}</label>
                  <input className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" style={{ fontFamily: "DM Sans, sans-serif" }} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Message</label>
                <textarea rows={5} className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm resize-none" style={{ fontFamily: "DM Sans, sans-serif" }} />
              </div>
              <button className="bg-[#C8181E] text-white px-8 py-3 border-2 border-black font-bold hover:bg-[#0D0D0D] transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>
                SEND MESSAGE
              </button>
              <div className="flex items-center gap-3 border-t-2 border-black/10 pt-4 mt-4">
                <div className="w-10 h-10 rounded-full bg-[#2D9E4F] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">WA</span>
                </div>
                <div>
                  <p className="font-bold text-sm">WhatsApp Support</p>
                  <p className="text-xs text-[#6B5B45]">Usually responds within 2 hours</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none text-sm leading-relaxed space-y-4 text-[#2A2A2A]" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <h3 className="font-bold text-base text-[#0D0D0D] mb-2">Section {i + 1}</h3>
                  <p>Lekhyas Studio operates this platform for the purpose of providing digital comic reading experiences. All content is protected under applicable copyright law. Use of this platform constitutes acceptance of these terms.</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: string) => void }) {
  return (
    <footer className="bg-[#0D0D0D] border-t-4 border-[#C8181E] relative overflow-hidden">
      <HalftoneOverlay opacity={0.12} />
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C8181E] border-3 border-[#F5C518] flex items-center justify-center" style={{ border: "3px solid #F5C518" }}>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "16px", color: "#FFF" }}>Ls</span>
              </div>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "18px", color: "#FFF", letterSpacing: "0.06em" }}>LEKHYAS STUDIO</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
              India's premier digital comic publishing platform. Bold stories. Real heroes. The Lekhyas Universe.
            </p>
          </div>
          {[
            { title: "Explore", links: [["Browse Comics", "browse"], ["Subscription Plans", "plans"], ["The Universe", "browse"], ["New Arrivals", "browse"]] },
            { title: "Account", links: [["Login", "login"], ["Sign Up", "login"], ["My Library", "library"], ["Order History", "login"]] },
            { title: "Company", links: [["Contact Us", "contact"], ["Terms & Conditions", "terms"], ["Privacy Policy", "privacy"], ["Admin", "admin"]] },
          ].map(col => (
            <div key={col.title}>
              <h3 className="text-[#F5C518] font-bold text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "Bangers, cursive", fontSize: "16px", letterSpacing: "0.06em" }}>{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(([label, page]) => (
                  <li key={label}>
                    <button onClick={() => setPage(page)} className="text-white/50 hover:text-white text-sm transition-colors" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
            © 2026 Lekhyas Studio. All rights reserved. No content may be downloaded or reproduced.
          </p>
          <div className="flex gap-2">
            <Badge text="ONLINE ONLY" variant="red" />
            <Badge text="NO DOWNLOADS" variant="blue" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    if (page !== "reader") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} />;
      case "browse": return <BrowsePage setPage={setPage} />;
      case "detail": return <ComicDetailPage setPage={setPage} />;
      case "reader": return <ReaderPage setPage={setPage} />;
      case "plans": return <PlansPage setPage={setPage} />;
      case "checkout": return <CheckoutPage setPage={setPage} />;
      case "library": return <LibraryPage setPage={setPage} />;
      case "login": return <LoginPage setPage={setPage} />;
      case "admin": return <AdminPanel setPage={setPage} />;
      case "terms": return <SimplePage title="Terms & Conditions" setPage={setPage} />;
      case "privacy": return <SimplePage title="Privacy Policy" setPage={setPage} />;
      case "contact": return <SimplePage title="Contact Us" setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {page !== "reader" && <NavBar currentPage={page} setPage={setPage} />}
      {renderPage()}
    </div>
  );
}
