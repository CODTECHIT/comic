import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Check, ChevronUp, ChevronDown } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { HalftoneOverlay } from "../components/ui/HalftoneOverlay";
import { Badge } from "../components/ui/Badge";
import { Footer } from "../components/layout/Footer";

export function PlansPage() {
  useSEO("Membership Plans", "Join the Lekhyas Universe. Read everything. Cancel anytime.");
  const { plans } = useAppContext();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes — cancel before your next billing date and you keep access until the end of the period. No questions asked." },
    { q: "Can I still buy single issues without a plan?", a: "Absolutely. Single-purchase and subscription access coexist — buy any title individually at any time." },
    { q: "Are comics downloadable?", a: "No. All reading happens in-browser only. This protects creator work and your subscription value." },
    { q: "How does billing work?", a: "All billing is handled securely via Razorpay. We accept major cards and UPI." },
    { q: "Is there a free trial?", a: "Each title has free sample pages — no sign-up needed. Full subscription trials are offered during launch promotions." },
  ];

  const activePlans = plans
    .filter((p: any) => p.is_active)
    .sort((a: any, b: any) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="relative bg-[#0D0D0D] py-16 text-center overflow-hidden">
        <HalftoneOverlay opacity={0.15} />
        <div className="relative">
          <Badge text="CHOOSE YOUR POWER LEVEL" variant="yellow" />
          <h1 className="text-white mt-4" style={{ fontFamily: "Bangers, cursive", fontSize: "clamp(36px, 7vw, 80px)", letterSpacing: "0.05em", textShadow: "4px 4px 0 #C8181E" }}>
            MEMBERSHIP PLANS
          </h1>
          <p className="text-white/60 mt-2 text-lg" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Join the Lekhyas Universe. Read everything. Cancel anytime.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "#F4EFE0", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {activePlans.length === 0 ? (
          <div className="py-20 text-center border-4 border-black bg-white" style={{ boxShadow: "8px 8px 0 #0D0D0D" }}>
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.05em" }} className="mb-4">NO MEMBERSHIP PLANS ARE CURRENTLY AVAILABLE.</h2>
            <p className="text-[#6B5B45] font-medium">Please check back later or purchase single issues.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activePlans.map((plan: any) => (
              <div key={plan.name} className="relative">
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-[#F5C518] text-black px-4 py-1 border-2 border-black font-bold text-sm"
                      style={{ fontFamily: "Bangers, cursive", fontSize: "14px", letterSpacing: "0.04em" }}>
                      ★ MOST POPULAR
                    </div>
                  </div>
                )}
                <div
                  className={`border-4 border-black h-full flex flex-col transition-transform hover:-translate-y-1 ${plan.is_popular ? "bg-[#0D0D0D] text-white" : "bg-white text-[#0D0D0D]"}`}
                  style={{ boxShadow: plan.is_popular ? "6px 6px 0 #C8181E" : "6px 6px 0 #0D0D0D" }}
                >
                  <div className={`p-6 border-b-4 border-black ${plan.is_popular ? "bg-[#C8181E]" : "bg-[#F4EFE0]"}`}>
                    <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "30px", letterSpacing: "0.06em", lineHeight: 1, color: plan.is_popular ? "#FFF" : "#0D0D0D" }}>
                      {plan.name}
                    </h2>
                    {plan.description && (
                      <p className="text-sm font-bold mt-2 opacity-80" style={{ fontFamily: "DM Sans, sans-serif" }}>{plan.description}</p>
                    )}
                    <div className="mt-4">
                      <span style={{ fontFamily: "Bangers, cursive", fontSize: "42px", lineHeight: 1, color: plan.is_popular ? "#F5C518" : "#C8181E" }}>₹{plan.price}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {(plan.features || []).map((f: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          <Check size={16} className={`mt-0.5 flex-shrink-0 ${plan.is_popular ? "text-[#F5C518]" : "text-[#2D9E4F]"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate("/checkout", { state: { isSubscription: true, planName: plan.name, price: plan.price, duration: plan.duration_months, features: plan.features } })}
                      className={`mt-6 w-full py-4 font-bold border-2 border-black transition-colors cursor-pointer ${plan.is_popular ? "bg-[#F5C518] text-black hover:bg-white" : "bg-[#C8181E] text-white hover:bg-[#0D0D0D]"}`}
                      style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em" }}>
                      SUBSCRIBE →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
            <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.05em" }}>FREQUENTLY ASKED</h2>
            <div className="flex-1 h-1 bg-[#0D0D0D]" />
          </div>
          <div className="space-y-2 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="border-4 border-black bg-white overflow-hidden" style={{ boxShadow: openFaq === i ? "4px 4px 0 #C8181E" : "2px 2px 0 #0D0D0D" }}>
                <button className="w-full flex items-center justify-between p-4 font-bold text-left cursor-pointer" style={{ fontFamily: "DM Sans, sans-serif" }}
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
      <Footer />
    </div>
  );
}
