import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { ImageUploadZone } from "../components/ImageUploadZone";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

export function ManageHomepage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [badge, setBadge] = useState("");
  const [accentColor, setAccentColor] = useState("#C8181E");
  const [img, setImg] = useState("");

  const fetchSlides = async () => {
    try {
      const res = await fetchApi(`${API_URL}/heroslides`);
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("Failed to fetch slides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSlide = {
        title, tagline, genre, price: Number(price), badge, accentColor, img
      };

      const res = await fetchApi(`${API_URL}/heroslides`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(newSlide),
      });

      if (res.ok) {
        setTitle(""); setTagline(""); setGenre(""); setPrice(""); setBadge(""); setImg("");
        fetchSlides();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Failed to add slide", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await fetchApi(`${API_URL}/heroslides/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
      });
      fetchSlides();
    } catch (err) {
      console.error("Failed to delete slide", err);
    }
  };

  if (loading) return <div className="p-8">Loading slides...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Configure the main hero carousel on the public landing page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Add New Slide</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. War-God" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline *</label>
              <input type="text" required value={tagline} onChange={e => setTagline(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. Son of Vayu" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Genre *</label>
                <input type="text" required value={genre} onChange={e => setGenre(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Mythic Warriors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="1499" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Badge</label>
                <input type="text" value={badge} onChange={e => setBadge(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="HOT, NEW" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Accent Color</label>
                <input type="color" required value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-full h-9 border rounded-md px-1 py-1 cursor-pointer" />
              </div>
            </div>
            <div className="mb-4">
              <ImageUploadZone 
                label="Cover Image *"
                description="Upload slide image"
                value={img}
                onChange={(val) => setImg(val as string)}
              />
            </div>
            <button type="submit" className="w-full bg-[#C8181E] text-white py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors mt-2">
              <Plus size={16} /> Add Slide
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Current Slides ({slides.length})</h2>
          {slides.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-500">
              <ImageIcon className="mx-auto text-slate-300 mb-2" size={48} />
              <p>No slides in the hero section yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slides.map(slide => (
                <div key={slide._id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
                  <div className="h-32 bg-slate-100 relative">
                    <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {slide.badge && <span className="absolute top-2 right-2 bg-[#F5C518] text-black text-[10px] font-bold px-2 py-0.5 uppercase">{slide.badge}</span>}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-900 leading-tight mb-1">{slide.title}</h3>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-1">{slide.tagline}</p>
                    <div className="flex items-center gap-2 mb-4 mt-auto">
                      <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: slide.accentColor }} />
                      <span className="text-xs font-medium text-slate-600">{slide.genre}</span>
                    </div>
                    <button onClick={() => handleDelete(slide._id)} className="w-full py-1.5 border border-red-200 text-red-600 rounded text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                      <Trash2 size={14} /> Remove Slide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
