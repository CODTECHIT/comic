import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut, Crown, BookMarked, ListOrdered } from "lucide-react";
import { API_URL } from "../config/api";
import { useSEO } from "../lib/useSEO";
import { useAppContext } from "../context/AppContext";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { ComicCard } from "../components/comic/ComicCard";
import { fetchApi } from "../lib/apiClient";
import { ErrorState } from "../components/ui/ErrorState";

export function UserDashboardPage() {
  useSEO("Dashboard", "Your digital comic library and subscription status");
  const { profile, logout, authLoading } = useAppContext();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    fetchApi(`${API_URL}/users/profile`, {
      headers: { "Authorization": `Bearer ${profile?.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        setError(err.message || "We're temporarily unable to load the content. Please try again in a few minutes.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [profile, navigate, authLoading]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-32 bg-black/10 rounded-lg w-full"></div>
          <div className="h-64 bg-black/10 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-32">
        <ErrorState message={error || "Error loading profile"} onRetry={fetchProfile} />
      </div>
    );
  }

  const hasSubscription = userData.subscriptionName && new Date(userData.subscriptionExpiry) > new Date();

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-12 overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="max-w-7xl mx-auto px-6 relative flex flex-col sm:flex-row items-center justify-between">
          <div>
            <p className="text-[#F5C518] text-sm font-bold uppercase tracking-widest mb-1">Welcome back,</p>
            <h1 className="text-white" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 5vw, 60px)", letterSpacing: "0.05em" }}>
              {userData.username || profile?.username || "HERO"}
            </h1>
          </div>
          <button onClick={handleLogout} className="mt-4 sm:mt-0 flex items-center gap-2 bg-[#C8181E] text-white px-6 py-2 font-bold border-2 border-[#C8181E] hover:bg-transparent hover:text-[#C8181E] transition-colors cursor-pointer" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Crown size={24} className="text-[#C8181E]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em" }}>YOUR SUBSCRIPTION</h2>
          </div>
          {hasSubscription ? (
            <div className="border-4 border-black bg-white p-6 max-w-lg" style={{ boxShadow: "6px 6px 0 #0D0D0D" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-xl uppercase">{userData.subscriptionName} PLAN</span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 border-2 border-green-800">ACTIVE</span>
              </div>
              <p className="text-[#6B5B45] text-sm font-bold mb-1">Deadline / Expiry Date:</p>
              <p className="text-2xl text-[#C8181E]" style={{ fontFamily: "Bangers, cursive" }}>
                {new Date(userData.subscriptionExpiry).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ) : (
            <div className="border-4 border-black bg-white p-6 max-w-lg" style={{ boxShadow: "6px 6px 0 #0D0D0D" }}>
              <p className="font-bold text-lg mb-2">No Active Subscription</p>
              <p className="text-[#6B5B45] text-sm mb-4">Unlock thousands of comics instantly.</p>
              <button onClick={() => navigate("/plans")} className="bg-[#1A4FCC] text-white px-6 py-2 font-bold hover:bg-black transition-colors border-2 border-black cursor-pointer">
                VIEW PLANS
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookMarked size={24} className="text-[#C8181E]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em" }}>PURCHASED COMICS</h2>
          </div>
          {userData.purchasedComics && userData.purchasedComics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {userData.purchasedComics.filter((c: any) => c != null).map((c: any) => (
                <ComicCard key={c._id || c.id} comic={c} onClick={() => navigate(`/reader/${c._id || c.id}`)} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-black/30 p-8 text-center text-[#6B5B45]">
              <p className="font-bold mb-2">You haven't bought any individual comics yet.</p>
              <button onClick={() => navigate("/browse")} className="text-[#C8181E] font-bold hover:underline cursor-pointer">BROWSE STORE</button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <ListOrdered size={24} className="text-[#C8181E]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em" }}>READING HISTORY</h2>
          </div>
          {userData.readingHistory && userData.readingHistory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {userData.readingHistory.filter((c: any) => c != null).map((c: any) => (
                <ComicCard key={c._id || c.id} comic={c} onClick={() => navigate(`/reader/${c._id || c.id}`)} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-black/30 p-8 text-center text-[#6B5B45]">
              <p className="font-bold">Your reading history is empty. Start reading today!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
