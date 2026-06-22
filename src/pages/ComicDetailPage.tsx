import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ShoppingCart, Plus, Crown, Eye, Lock, BookOpen, Zap, MessageSquare } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { API_URL } from "../config/api";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Badge } from "../components/ui/Badge";
import { ComicCard } from "../components/comic/ComicCard";
import { Footer } from "../components/layout/Footer";
import { fetchApi } from "../lib/apiClient";
import { ErrorState } from "../components/ui/ErrorState";

function CommentsSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const userStr = localStorage.getItem("user");
  const parsed = userStr ? JSON.parse(userStr) : null;
  const user = parsed?.user ? parsed.user : parsed;
  const token = user?.token;

  useEffect(() => {
    fetchApi(`${API_URL}/comments?status=approved`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Failed to load comments", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Please log in to leave a comment.");
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment, rating: 5 })
      });
      if (res.ok) {
        const created = await res.json();
        setComments([created, ...comments]);
        setNewComment("");
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 bg-white border-4 border-black p-6 md:p-8" style={{ boxShadow: "8px 8px 0 #0D0D0D" }}>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={28} className="text-[#C8181E]" />
        <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.04em" }}>USER COMMENTS</h2>
      </div>

      {token ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#F4EFE0] p-5 border-2 border-black">
          <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Leave a Comment as {user.username || user.email}</h3>
          <textarea
            placeholder="What did you think about this comic?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-2 border-black p-3 text-sm focus:outline-none focus:border-[#C8181E] min-h-[100px] mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C8181E] text-white px-8 py-3 font-bold border-2 border-black hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.04em" }}
          >
            {loading ? "POSTING..." : "POST COMMENT"}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-[#F4EFE0] p-8 border-2 border-black text-center">
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>JOIN THE DISCUSSION</h3>
          <p className="text-sm text-[#6B5B45] mb-4">You must be logged in to leave a comment on this comic.</p>
          <button onClick={() => window.location.href = "/login"} className="inline-block bg-[#1A4FCC] text-white px-8 py-3 font-bold border-2 border-black hover:bg-black transition-colors cursor-pointer" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>
            LOGIN NOW
          </button>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-[#6B5B45] text-sm italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(c => (
            <div key={c._id || Math.random()} className="border-b-2 border-black/10 pb-6">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-black">{c.userName}</span>
                <span className="text-xs text-[#6B5B45]">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-[#2A2A2A] leading-relaxed whitespace-pre-wrap">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ComicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comics, addToCart, loadingStoreData, plans } = useAppContext();
  
  const activePlans = plans.filter((p: any) => p.is_active !== false);
  const lowestPlan = activePlans.length > 0 
    ? activePlans.reduce((min, p) => p.price < min.price ? p : min, activePlans[0]) 
    : null;
  
  const comic = comics.find(c => (c.id === id || c._id === id)) || comics[0];
  const related = comics.filter(c => c.id !== comic?.id).slice(0, 4);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAppContext();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useSEO(comic ? comic.title : "Comic Details", comic ? comic.synopsis : "");

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-20 flex flex-col items-center justify-center">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (loadingStoreData || !comic) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-20 px-6">
        <div className="max-w-7xl mx-auto py-10 space-y-8 animate-pulse">
          <div className="h-[400px] bg-black/10 rounded-lg w-full"></div>
          <div className="h-32 bg-black/10 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="relative border-4 border-black overflow-hidden" style={{ boxShadow: "10px 10px 0 #0D0D0D", maxWidth: 380 }}>
              <div className="relative" style={{ aspectRatio: "2/3", background: comic.accentColor }}>
                <img src={comic.img} alt={comic.title} className="w-full h-full object-cover" />
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
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-2">Preview Pages</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="w-16 h-24 border-2 border-black overflow-hidden bg-[#888] relative cursor-pointer hover:opacity-80">
                    <img src={comic.img} alt={`Page ${n}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white text-xs font-bold">{n}</span>
                    </div>
                  </div>
                ))}
                <div className="w-16 h-24 border-2 border-dashed border-black flex items-center justify-center bg-[#E8E0CC] cursor-pointer hover:bg-[#F5C518] transition-colors" onClick={() => navigate(`/reader/${comic.id || comic._id}`)}>
                  <span className="text-xs font-bold text-center leading-tight px-1">Read More</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge text={comic.genre} variant="blue" />
              <Badge text={`${comic.issues} Issues`} variant="yellow" />
              <Badge text="All Ages" variant="yellow" />
            </div>
            <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(40px, 5vw, 60px)", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              {comic.title}
            </h1>
            <p className="text-[#6B5B45] text-lg mt-1 mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>"{comic.tagline}"</p>

            <div className="border-4 border-black bg-white p-5 mb-6" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "DM Sans, sans-serif", color: "#2A2A2A" }}>
                {comic.synopsis || "No description available."}
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-black/10 text-sm text-[#6B5B45]">
                <span><strong>Creator:</strong> {comic.creator || "Lekhyas Studio"}</span>
                <span><strong>Issues:</strong> {comic.issuesInfo || "N/A"}</span>
                <span><strong>Pages:</strong> {comic.pageCount || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-1">Single Issue Price</p>
                <p style={{ fontFamily: "Bangers, cursive", fontSize: "48px", lineHeight: 1, color: "#0D0D0D" }}>₹{comic.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="border-l-2 border-black/20 pl-4">
                {lowestPlan ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-1">UNLIMITED ACCESS STARTS AT</p>
                    <p style={{ fontFamily: "Bangers, cursive", fontSize: "28px", lineHeight: 1, color: "#C8181E" }}>₹{lowestPlan.price.toLocaleString("en-IN")}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6B5B45] mb-1">Notice</p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", lineHeight: 1.2, color: "#C8181E", marginTop: "4px" }}>Memberships currently unavailable.</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {hasAccess ? (
                <button onClick={() => navigate(`/reader/${comic.id || comic._id}`)}
                  className="flex items-center gap-2 bg-[#2D9E4F] text-white px-8 py-4 font-bold border-4 border-black hover:bg-[#0D0D0D] transition-colors cursor-pointer"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em", boxShadow: "4px 4px 0 #000" }}>
                  <BookOpen size={18} /> READ NOW
                </button>
              ) : (
                <button onClick={() => setShowPurchaseOptions(true)}
                  className="flex items-center gap-2 bg-[#C8181E] text-white px-8 py-4 font-bold border-4 border-black hover:bg-[#0D0D0D] transition-colors cursor-pointer"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em", boxShadow: "4px 4px 0 #000" }}>
                  <ShoppingCart size={18} /> BUY BOOK
                </button>
              )}
              {!hasAccess && (
                <button onClick={() => navigate(`/reader/${comic.id || comic._id}`)}
                  className="flex items-center gap-2 border-4 border-black text-black px-6 py-4 font-bold hover:bg-[#F5C518] transition-colors cursor-pointer bg-white"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "18px", letterSpacing: "0.04em", boxShadow: "4px 4px 0 #000" }}>
                  <Eye size={18} /> FREE SAMPLE
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#6B5B45] font-medium border-t-2 border-black/10 pt-4">
              <span className="flex items-center gap-1"><Lock size={12} /> Secure Payment</span>
              <span className="flex items-center gap-1"><BookOpen size={12} /> Online Read Only</span>
              <span className="flex items-center gap-1"><Zap size={12} /> Instant Access</span>
            </div>
          </div>
        </div>

        <CommentsSection />

        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em" }}>YOU MIGHT ALSO LIKE</h2>
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
            {related.map((c: any) => <ComicCard key={c.id || c._id} comic={c} onClick={() => navigate(`/comic/${c.id || c._id}`)} />)}
          </div>
        </div>
      </div>
      <Footer />

      {/* Purchase Options Modal */}
      {showPurchaseOptions && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#F4EFE0] border-4 border-black max-w-3xl w-full p-6 md:p-10 relative" style={{ boxShadow: "10px 10px 0 #0D0D0D" }}>
            <button onClick={() => setShowPurchaseOptions(false)} className="absolute top-4 right-4 text-black hover:text-[#C8181E] font-bold cursor-pointer">
              X CLOSE
            </button>
            
            <h2 className="text-center mb-8" style={{ fontFamily: "Bangers, cursive", fontSize: "40px", letterSpacing: "0.04em" }}>HOW WOULD YOU LIKE TO READ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1 */}
              <div className="bg-white border-4 border-black p-6 flex flex-col hover:-translate-y-1 transition-transform" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
                <div className="mb-4">
                  <Badge text="OPTION 1" variant="blue" />
                </div>
                <h3 className="mb-2" style={{ fontFamily: "Bangers, cursive", fontSize: "28px" }}>BUY THIS BOOK ONLY</h3>
                <p className="text-[#6B5B45] text-sm mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>Purchase this specific issue and add it to your library forever.</p>
                <ul className="text-sm space-y-2 mb-6 flex-1 text-[#2A2A2A] font-bold">
                  <li>• Access only {comic.title}</li>
                  <li>• Instant digital access</li>
                  <li>• No recurring fees</li>
                </ul>
                <button onClick={() => {
                    addToCart(comic);
                    navigate("/checkout");
                  }} 
                  className="w-full bg-[#1A4FCC] text-white py-3 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors cursor-pointer"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px" }}>
                  BUY FOR ₹{comic.price}
                </button>
              </div>

              {/* Option 2 */}
              <div className="bg-[#0D0D0D] border-4 border-black p-6 flex flex-col text-white hover:-translate-y-1 transition-transform" style={{ boxShadow: "4px 4px 0 #C8181E" }}>
                <div className="mb-4">
                  <Badge text="OPTION 2" variant="yellow" />
                </div>
                <h3 className="mb-2" style={{ fontFamily: "Bangers, cursive", fontSize: "28px", color: "#F5C518" }}>BUY MEMBERSHIP</h3>
                <p className="text-white/70 text-sm mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>Unlock the entire universe. Read everything we publish.</p>
                <ul className="text-sm space-y-2 mb-6 flex-1 text-white/90 font-bold">
                  <li>• Unlimited access to ALL books</li>
                  <li>• Read {comic.title} and every other issue</li>
                  {lowestPlan ? (
                    <li>• Starting at ₹{lowestPlan.price.toLocaleString("en-IN")}</li>
                  ) : (
                    <li className="text-[#C8181E]">• Memberships currently unavailable.</li>
                  )}
                </ul>
                <button onClick={() => navigate("/plans")}
                  className="w-full bg-[#F5C518] text-black py-3 font-bold border-2 border-black hover:bg-white transition-colors cursor-pointer"
                  style={{ fontFamily: "Bangers, cursive", fontSize: "20px" }}>
                  VIEW SUBSCRIPTION PLANS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
