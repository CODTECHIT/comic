import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { API_URL } from "../config/api";
import { fetchApi } from "../lib/apiClient";
import { ErrorState } from "../components/ui/ErrorState";

export function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comics, loadingStoreData, profile } = useAppContext();
  
  const comic = comics.find(c => (c.id === id || c._id === id)) || comics[0];
  
  const [page, setPageNum] = useState(1);
  const [barVisible, setBarVisible] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useSEO(comic ? `Reading ${comic.title}` : "Reader");

  useEffect(() => {
    if (!profile) {
      setHasAccess(false);
      return;
    }
    const checkAccess = async () => {
      setError(null);
      try {
        const res = await fetchApi(`${API_URL}/users/access/${id}`, {
          headers: { "Authorization": `Bearer ${profile.token}` }
        });
        const data = await res.json();
        setHasAccess(data.hasAccess);
      } catch (err: any) {
        setError(err.message || "We're temporarily unable to load the content. Please try again in a few minutes.");
        setHasAccess(false);
      }
    };
    checkAccess();
  }, [id, profile]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col pt-32">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (loadingStoreData || !comic || hasAccess === null) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-[#222] rounded-full mx-auto"></div>
          <div className="h-4 bg-[#222] w-32 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  const isPdf = !!comic.pdfUrl;
  const total = isPdf ? 1 : (comic.pages?.length || 12);
  const imgIds = comic.pages && comic.pages.length > 0 
    ? comic.pages 
    : ["/images/comic-10.jpeg", "/images/comic-11.jpeg", "/images/comic-12.jpeg", "/images/comic-13.jpeg", "/images/comic-14.jpeg", "/images/comic-15.jpeg"];

  const FREE_SAMPLE_LIMIT = 3;
  const isBlocked = !hasAccess && (isPdf || page > FREE_SAMPLE_LIMIT);

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-6 py-3 bg-[#0D0D0D] border-b-2 border-[#222] transition-opacity duration-300 ${barVisible ? "opacity-100" : "opacity-0"}`}
        style={{ zIndex: 10 }}
      >
        <button onClick={() => navigate(`/comic/${comic.id || comic._id}`)} className="flex items-center gap-2 text-[#F5C518] hover:text-white transition-colors font-bold text-sm cursor-pointer">
          <ChevronLeft size={16} /> BACK
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm" style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.05em" }}>{comic.title}</p>
          <p className="text-white/50 text-xs">{!hasAccess && "FREE SAMPLE • "}{comic.issuesInfo || "Issue #1"}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isPdf && <span className="text-white/60 text-sm">{page} / {total}</span>}
          <button onClick={() => setBarVisible(!barVisible)} className="text-white/40 hover:text-white transition-colors text-xs font-bold cursor-pointer">
            {barVisible ? "HIDE" : "SHOW"} UI
          </button>
        </div>
      </div>

      {/* Page display */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={() => setBarVisible(!barVisible)}>
        {isBlocked ? (
          <div className="w-full max-w-md mx-auto text-center p-8 bg-[#111] border-4 border-[#222] z-20">
            <h2 className="text-white mb-4" style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.05em" }}>END OF FREE SAMPLE</h2>
            <p className="text-white/70 mb-8">Purchase this comic or subscribe to a plan to read the rest of the issue.</p>
            <div className="space-y-4">
              <button onClick={(e) => { e.stopPropagation(); navigate(`/comic/${comic.id || comic._id}`); }} 
                className="w-full bg-[#C8181E] text-white py-3 font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px" }}>
                VIEW PURCHASE OPTIONS
              </button>
              {!isPdf && (
                <button onClick={(e) => { e.stopPropagation(); setPageNum(FREE_SAMPLE_LIMIT); }} className="text-white/50 hover:text-white text-sm font-bold cursor-pointer">
                  Go back to sample
                </button>
              )}
            </div>
          </div>
        ) : (
          isPdf ? (
            <div className="w-full h-full bg-[#111] flex items-center justify-center">
              <iframe 
                src={`${comic.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-full max-w-4xl border-x-4 border-[#222]" 
                title={comic.title}
              />
              <div className="absolute inset-0 pointer-events-none" onContextMenu={e => e.preventDefault()}></div>
            </div>
          ) : (
            <>
              <div className="relative" style={{ maxHeight: "calc(100vh - 130px)", aspectRatio: "2/3", position: "relative" }}>
                <div className="w-full h-full border-4 border-[#222] overflow-hidden" style={{ maxHeight: "calc(100vh - 130px)", maxWidth: "calc((100vh - 130px) * 2/3)" }}>
                  <img
                    src={imgIds[(page - 1) % imgIds.length]}
                    alt={`Page ${page}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white/[0.03] font-bold select-none" style={{ fontFamily: "Bangers, cursive", fontSize: "80px", transform: "rotate(-35deg)", letterSpacing: "0.1em" }}>
                      LEKHYAS STUDIO
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "14px" }}>
                    {page}
                  </div>
                </div>
              </div>

              <button onClick={(e) => { e.stopPropagation(); if (page > 1) setPageNum(p => p - 1); }}
                disabled={page <= 1}
                className="absolute left-4 w-12 h-12 bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8181E] disabled:opacity-20 transition-colors cursor-pointer">
                <ChevronLeft size={22} />
              </button>
              <button onClick={(e) => { 
                  e.stopPropagation(); 
                  if (!hasAccess && page >= FREE_SAMPLE_LIMIT) {
                    setPageNum(FREE_SAMPLE_LIMIT + 1); // Triggers block
                  } else if (page < total) {
                    setPageNum(p => p + 1); 
                  }
                }}
                disabled={page >= total && hasAccess}
                className="absolute right-4 w-12 h-12 bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8181E] disabled:opacity-20 transition-colors cursor-pointer">
                <ChevronRight size={22} />
              </button>
            </>
          )
        )}
      </div>

      {/* Bottom bar */}
      {!isPdf && (
        <div className={`bg-[#0D0D0D] border-t-2 border-[#222] px-4 py-3 transition-opacity duration-300 ${barVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <button onClick={() => setPageNum(1)} className="text-white/50 hover:text-white text-xs font-bold transition-colors cursor-pointer">FIRST</button>
            <div className="flex-1 relative h-2 bg-[#222] rounded-none cursor-pointer" onClick={e => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              const targetPage = Math.max(1, Math.min(total, Math.round(pct * total)));
              if (!hasAccess && targetPage > FREE_SAMPLE_LIMIT) {
                setPageNum(FREE_SAMPLE_LIMIT + 1);
              } else {
                setPageNum(targetPage);
              }
            }}>
              <div className="h-full bg-[#C8181E] transition-all" style={{ width: `${(page / total) * 100}%` }} />
            </div>
            <button onClick={() => {
              if (!hasAccess) setPageNum(FREE_SAMPLE_LIMIT + 1);
              else setPageNum(total);
            }} className="text-white/50 hover:text-white text-xs font-bold transition-colors cursor-pointer">LAST</button>
          </div>
          <div className="flex gap-1 justify-center mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => {
                  if (!hasAccess && i + 1 > FREE_SAMPLE_LIMIT) setPageNum(FREE_SAMPLE_LIMIT + 1);
                  else setPageNum(i + 1);
                }}
                className={`flex-shrink-0 w-8 h-10 border transition-colors overflow-hidden cursor-pointer ${page === i + 1 ? "border-[#C8181E]" : "border-[#333] hover:border-[#666]"}`}>
                <img src={imgIds[i % imgIds.length]} alt={`${i + 1}`} className="w-full h-full object-cover" />
                {!hasAccess && i + 1 > FREE_SAMPLE_LIMIT && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[8px]">🔒</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
