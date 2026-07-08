import React from "react";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Footer } from "../components/layout/Footer";
import { useSEO } from "../lib/useSEO";
import { fetchApi } from "../lib/apiClient";
import { API_URL } from "../config/api";
import { useState } from "react";

export function SimplePage({ title }: { title: string }) {
  useSEO(title, `Read our ${title}`);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetchApi(`${API_URL}/send-email/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        let errMsg = errData.message || errData.error || "Failed to send message.";
        if (errData.errors && Array.isArray(errData.errors)) {
          errMsg += ": " + errData.errors.map((e: { message: string }) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message. Please try again.");
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
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 text-[#2A2A2A]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div>
                  <h2 className="text-xl font-bold mb-2 uppercase tracking-wide text-[#0D0D0D]">Who we are !</h2>
                  <p className="text-sm leading-relaxed mb-4">
                    Lekhya's Studio Unlimited is premier digital comics and subscription service for instant access to over 25+ digital comics and movie production house.
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Contact for Tie-ups</h2>
                  <p className="text-sm text-[#6B5B45]">
                    e-mail us for all kind of promotion in film to us by mailing to <a href="mailto:manager@lekhyas.com" className="text-[#C8181E] font-bold">manager@lekhyas.com</a>
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-1">General Query</h2>
                  <p className="text-sm text-[#6B5B45]">
                    for all kind of general enquiry please mail us to <a href="mailto:studio@lekhyas.com" className="text-[#C8181E] font-bold">studio@lekhyas.com</a>
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Comic Query</h2>
                  <p className="text-sm text-[#6B5B45]">
                    type us for story design works regards comic to <a href="mailto:comic@lekhyas.com" className="text-[#C8181E] font-bold">comic@lekhyas.com</a>
                  </p>
                </div>

                <hr className="border-t-2 border-black/10" />

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider mb-1">Address</h2>
                  <p className="text-sm text-[#6B5B45]">
                    NO. 35<br />
                    13TH MAIN 4TH CROSS , C K NAGAR HOSA ROAD,<br />
                    HOSA ROAD : Bengaluru -560100<br />
                    Phone: <a href="tel:8050896996" className="font-bold text-[#0D0D0D]">8050896996</a>
                  </p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <p className="font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>REACH US !</p>

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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 border-black px-4 py-3 bg-[#F4EFE0] focus:outline-none focus:border-[#C8181E] text-sm"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B45] mb-1 flex justify-between">
                    <span>Message</span>
                    <span>{formData.message.length} / 180</span>
                  </label>
                  <textarea
                    required
                    maxLength={180}
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                  {status === "loading" ? "SENDING..." : "SUBMIT"}
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
      <Footer />
    </div>
  );
}
