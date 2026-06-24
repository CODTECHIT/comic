import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Badge } from "../components/ui/Badge";
import { SpeechBubbleBadge } from "../components/ui/SpeechBubbleBadge";
import { ComicRow } from "../components/comic/ComicRow";
import { HeroSection } from "../components/layout/HeroSection";
import { Footer } from "../components/layout/Footer";
import { Crown } from "lucide-react";
import { API_URL } from "../config/api";
import { fetchApi } from "../lib/apiClient";

function GallerySection() {
  const galleryImages = [
    "/images/comic-10.jpeg", "/images/comic-11.jpeg", "/images/comic-12.jpeg",
    "/images/comic-13.jpeg", "/images/comic-14.jpeg", "/images/comic-15.jpeg",
    "/images/comic-16.jpeg", "/images/comic-17.jpeg", "/images/comic-18.jpeg", "/images/comic-19.jpeg"
  ];

  return (
    <div className="bg-[#0D0D0D] py-16 relative border-y-8 border-black">
      <HalftoneOverlay opacity={0.15} />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center gap-3 mb-10">
          <SpeechBubbleBadge text="ARTWORK" />
          <h2 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "0.05em", textShadow: "4px 4px 0 #C8181E" }}>
            THE LEKHYAS UNIVERSE GALLERY
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <div key={i} className={`relative group overflow-hidden border-4 border-black bg-black ${i % 5 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`} style={{ boxShadow: "4px 4px 0 #000" }}>
              <img src={img} alt={`Gallery artwork ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 40%)` }} />
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#F5C518] transition-colors pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="w-8 h-8 rounded-full bg-[#C8181E] border-2 border-[#F5C518] flex items-center justify-center">
                  <span style={{ fontFamily: "Bangers, cursive", fontSize: "13px", color: "#FFF" }}>Ls</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  useSEO("Home", "Welcome to the Lekhyas Universe");
  const { comics, categories, loadingStoreData, plans } = useAppContext();
  const activePlans = plans?.filter(p => p.isActive) || [];
  const lowestPrice = activePlans.length > 0 ? Math.min(...activePlans.map(p => p.price)) : null;
  const navigate = useNavigate();

  const [adBanner, setAdBanner] = useState<any>(null);

  useEffect(() => {
    const fetchAdBanner = async () => {
      try {
        const res = await fetchApi(`${API_URL}/adbanner`);
        const data = await res.json();
        if (data && data.isActive) setAdBanner(data);
      } catch (err) {
        console.error("Failed to fetch ad banner", err);
      }
    };
    fetchAdBanner();
  }, []);

  const grouped = categories
    .map(cat => ({ ...cat, items: comics.filter((c: any) => c.genre === cat.name) }))
    .filter(cat => cat.items.length > 0);

  // Adapter for old setPage prop pattern used in HeroSection and ComicRow
  const setPage = (path: string) => navigate(`/${path}`);
  const setSelectedComic = (comic: any) => navigate(`/comic/${comic.id || comic._id}`);

  if (loadingStoreData) {
    return (
      <div className="min-h-screen bg-[#F4EFE0]">
        <div className="w-full h-[60vh] bg-[#E8E0CC] animate-pulse border-b-8 border-black"></div>
        <div className="py-10 max-w-7xl mx-auto px-4">
          <div className="h-10 w-64 bg-[#E8E0CC] animate-pulse mb-8 border-2 border-black"></div>
          <div className="flex gap-5 overflow-hidden">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="w-[220px] h-[340px] bg-[#E8E0CC] animate-pulse border-4 border-black flex-shrink-0" style={{ boxShadow: "6px 6px 0 #0D0D0D" }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />

      {grouped.length > 0 ? grouped.map((cat) => (
        <div key={cat.name} className="relative bg-[#F4EFE0]">
          <HalftoneOverlay opacity={0.03} />
          <ComicRow title={cat.name} comics={cat.items} onComicClick={setSelectedComic} onViewAll={() => setPage("browse")} />
        </div>
      )) : (
        <div className="py-20 text-center bg-[#F4EFE0]">
          <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.05em" }} className="mb-4">NO BOOKS AVAILABLE YET</h2>
          <p className="text-[#6B5B45] font-medium">New books are coming soon! Stay tuned to the Lekhyas Universe.</p>
        </div>
      )}

      {adBanner && (
        <div className="w-full bg-black py-8 border-y-8 border-[#1A1A1A] flex justify-center relative overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(45deg, #0a0a0a, #0a0a0a 10px, #000 10px, #000 20px)" }}>
          <div className="max-w-5xl px-4 w-full text-center relative z-10 flex flex-col items-center">
            <div className="mb-4">
              <span className="text-[#F5C518] text-xs md:text-sm tracking-[0.2em] uppercase bg-black px-4 py-1.5 border-2 border-[#F5C518]" style={{ fontFamily: "Bangers, cursive", boxShadow: "3px 3px 0 #C8181E" }}>SPONSORED TRANSMISSION</span>
            </div>
            {adBanner.linkUrl ? (
              <a href={adBanner.linkUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer hover:scale-[1.01] transition-transform duration-300 w-full">
                <img src={adBanner.imageUrl} alt="Advertisement" className="w-full h-[120px] md:h-[200px] object-cover mx-auto border-4 border-black" style={{ boxShadow: "6px 6px 0 #F5C518" }} />
              </a>
            ) : (
              <div className="w-full">
                <img src={adBanner.imageUrl} alt="Advertisement" className="w-full h-[120px] md:h-[200px] object-cover mx-auto border-4 border-black" style={{ boxShadow: "6px 6px 0 #F5C518" }} />
              </div>
            )}
          </div>
        </div>
      )}

      <GallerySection />

      <div className="relative overflow-hidden" style={{ background: "#C8181E" }}>
        <HalftoneOverlay opacity={0.1} />
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <Badge text="UNLIMITED ACCESS" variant="yellow" />
          <h2 className="text-white mt-4 mb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "0.04em", textShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}>
            READ THE ENTIRE LEKHYAS UNIVERSE
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Subscribe and get unlimited access to all {comics.length > 0 ? `${comics.length}` : "9"}+ titles.
            {lowestPrice !== null ? (
              <span> Starting at just ₹{lowestPrice}.</span>
            ) : (
              <span> <button onClick={() => setPage("plans")} className="underline hover:text-[#F5C518] transition-colors cursor-pointer">Check our membership plans.</button></span>
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setPage("plans")}
              className="bg-[#F5C518] text-black px-10 py-4 font-bold border-4 border-black hover:bg-white transition-colors cursor-pointer"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.05em", boxShadow: "5px 5px 0 #000" }}>
              <Crown size={20} className="inline mr-2" /> SEE ALL PLANS
            </button>
            <button onClick={() => setPage("browse")}
              className="border-4 border-white text-white px-10 py-4 font-bold hover:bg-white hover:text-[#C8181E] transition-colors cursor-pointer"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.05em" }}>
              BROWSE FREE SAMPLES
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
