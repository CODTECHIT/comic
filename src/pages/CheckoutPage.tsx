import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Lock, BookOpen, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSEO } from "../lib/useSEO";
import { API_URL } from "../config/api";
import { fetchApi } from "../lib/apiClient";

export function CheckoutPage() {
  useSEO("Checkout", "Complete your purchase");
  const { cart, setCart, profile, authLoading } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const subState = location.state?.isSubscription ? location.state : null;

  const [email, setEmail] = useState(profile?.email || "");
  const [name, setName] = useState(profile?.username || "");
  const [loading, setLoading] = useState(false);

  const totalAmount = subState ? subState.price : (cart?.reduce((acc: number, c: any) => acc + c.price, 0) || 0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!profile) {
      navigate("/login");
      return;
    }
    if (!subState && cart.length === 0) return;

    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const comicIds = subState ? undefined : cart.map((c: any) => c._id || c.id).filter(Boolean);
      const planName = subState ? subState.planName : undefined;
      const orderRes = await fetchApi(`${API_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${profile.token}`
        },
        body: JSON.stringify({ comicIds, planName, currency: "INR" })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Lekhyas Studio",
        description: subState ? `Subscription: ${subState.planName}` : `Purchase of ${cart.length} comic${cart.length > 1 ? "s" : ""}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetchApi(`${API_URL}/orders/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${profile.token}`
              },
              body: JSON.stringify({
                ...response,
                comicIds,
                planName
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (!subState) setCart([]);
              navigate("/dashboard");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            alert("Payment verified but failed to update account. Please contact support.");
          }
        },
        prefill: { name, email },
        theme: { color: "#C8181E" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      console.log("Razorpay options:", options);
      console.log("Order Data received:", orderData);

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || "Please try again."}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed to initialize. Please try again.");
      setLoading(false);
    }
  };

  if (!subState && (!cart || cart.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-32 text-center">
        <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "40px" }}>CART IS EMPTY</h1>
        <button onClick={() => navigate("/browse")} className="mt-4 bg-[#C8181E] text-white px-6 py-2 font-bold hover:bg-black transition-colors border-2 border-black cursor-pointer">BROWSE COMICS</button>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4EFE0] pt-32 text-center">
        <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "40px" }}>LOADING...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE0] pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "52px", letterSpacing: "0.05em" }}>CHECKOUT</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-6">
          <div className="md:col-span-3">
            <div className="border-4 border-black bg-white p-6 mb-4" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <h2 className="font-bold text-lg mb-4 border-b-2 border-black/10 pb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "24px", letterSpacing: "0.04em" }}>ORDER SUMMARY</h2>
              <div className="space-y-4">
                {subState ? (
                  <div className="flex flex-col gap-4 border-b border-black/5 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 border-2 border-black flex-shrink-0 flex items-center justify-center bg-[#F5C518]">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>{subState.planName} Membership</p>
                        <p className="text-xs text-[#6B5B45]">Duration: {subState.duration} Month(s)</p>
                      </div>
                      <p style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>₹{subState.price}</p>
                    </div>
                    <div className="text-sm mt-2">
                      <p className="font-bold text-xs uppercase tracking-wider text-[#6B5B45] mb-2">Benefits:</p>
                      <ul className="space-y-1">
                        {subState.features?.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#2D9E4F]">•</span>
                            <span style={{ fontFamily: "DM Sans, sans-serif" }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  cart.map((comic: any) => (
                    <div key={comic.id || comic._id} className="flex items-center gap-4 border-b border-black/5 pb-4 last:border-0 last:pb-0">
                      <div className="w-12 h-16 border-2 border-black overflow-hidden flex-shrink-0" style={{ background: "#C8181E" }}>
                        <img src={comic.img} alt={comic.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-1" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>{comic.title}</p>
                        <p className="text-xs text-[#6B5B45]">{comic.genre}</p>
                      </div>
                      <p style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>₹{comic.price}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t-2 border-black/10 mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "24px" }}>₹{totalAmount}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#6B5B45] font-medium">
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><Lock size={12} /> Secured by Razorpay</span>
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><BookOpen size={12} /> No downloads — online read only</span>
              <span className="flex items-center gap-1 border border-black/20 px-3 py-2 bg-white"><Zap size={12} /> Instant access after payment</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="border-4 border-black bg-white p-6" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
              <h2 className="font-bold mb-4 border-b-2 border-black/10 pb-3" style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.04em" }}>PAYMENT</h2>
              {!profile ? (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-bold text-[#C8181E] mb-2">You must be logged in to buy.</p>
                  <button onClick={() => navigate("/login")} className="w-full bg-[#1A4FCC] text-white py-3 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors cursor-pointer" style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>LOGIN NOW</button>
                </div>
              ) : (
                <div className="mb-6 border-2 border-dashed border-[#2D9E4F] bg-[#2D9E4F]/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2D9E4F] mb-1">Logged In As</p>
                  <p className="font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>{profile.username}</p>
                  <p className="text-sm text-[#6B5B45]">{profile.email}</p>
                </div>
              )}
              <button disabled={loading || !profile} onClick={handlePayment}
                className="w-full bg-[#1A4FCC] text-white py-4 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors disabled:opacity-50 cursor-pointer"
                style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.04em", boxShadow: "3px 3px 0 #000" }}>
                {loading ? "PROCESSING..." : `PAY ₹${totalAmount} via RAZORPAY`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
