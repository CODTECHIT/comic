import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { ComicCard } from "../components/comic/ComicCard";
import { Footer } from "../components/layout/Footer";

export function BrowsePage() {
  useSEO("Browse Comics", "Browse all comics in the Lekhyas Universe");
  const { comics, categories, loadingStoreData } = useAppContext();
  const navigate = useNavigate();

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
          <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.05em", textShadow: "4px 4px 0 #C8181E" }}>
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
                className={`px-4 py-1.5 border-2 border-black font-bold text-sm transition-colors cursor-pointer ${activeGenre === g ? "bg-[#C8181E] text-white border-[#C8181E]" : "bg-white text-black hover:bg-[#F5C518]"}`}
                style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
                {g}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="border-2 border-black bg-white px-3 py-2 text-sm font-bold cursor-pointer" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {["New", "Price ↑", "Price ↓"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loadingStoreData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <div key={n} className="w-full aspect-[2/3] bg-[#E8E0CC] animate-pulse border-4 border-black" style={{ boxShadow: "6px 6px 0 #0D0D0D" }}></div>
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sorted.map((c: any) => (
              <ComicCard key={c.id || c._id} comic={c} onClick={() => navigate(`/comic/${c.id || c._id}`)} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-4 border-black bg-white" style={{ boxShadow: "8px 8px 0 #0D0D0D" }}>
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.05em" }} className="mb-4">NO BOOKS FOUND</h2>
            <p className="text-[#6B5B45] font-medium">Try changing your filters or check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
