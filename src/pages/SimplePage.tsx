import React from "react";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Footer } from "../components/layout/Footer";
import { useSEO } from "../lib/useSEO";
import { fetchApi } from "../lib/apiClient";
import { API_URL } from "../config/api";
import { useState } from "react";

export function SimplePage({ title }: { title: string }) {
  useSEO(title, `Read our ${title}`);

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    
    try {
      await fetchApi(`${API_URL}/emails/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    }
  };

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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <p className="font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>GET IN TOUCH</p>
              
              {status === "success" && (
                <div className="p-3 bg-green-100 text-green-700 text-sm font-bold border-l-4 border-green-500">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="p-3 bg-red-100 text-red-700 text-sm font-bold border-l-4 border-red-500">
                  {errorMsg}
                </div>
              )}

              {["Name", "Email", "Subject"].map(f => {
                const key = f.toLowerCase() as keyof typeof formData;
                return (
                  <div key={f}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">{f}</label>
                    <input 
                      required
                      type={f === "Email" ? "email" : "text"}
                      value={formData[key]}
                      onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                      className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm" 
                      style={{ fontFamily: "DM Sans, sans-serif" }} 
                    />
                  </div>
                );
              })}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Message</label>
                <textarea 
                  required
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm resize-none" 
                  style={{ fontFamily: "DM Sans, sans-serif" }} 
                />
              </div>
              <button 
                type="submit"
                disabled={status === "loading"}
                className="bg-[#C8181E] text-white px-8 py-3 border-2 border-black font-bold hover:bg-[#0D0D0D] transition-colors cursor-pointer disabled:opacity-50" 
                style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}
              >
                {status === "loading" ? "SENDING..." : "SEND MESSAGE"}
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
            </form>
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
      <Footer />
    </div>
  );
}
