
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../../context/AppContext';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart } = useAppContext();
  const navigate = useNavigate();
  const total = cart.reduce((acc, c) => acc + (c.price || 0), 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-[#F4EFE0] z-50 border-l-4 border-black flex flex-col shadow-2xl" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <div className="p-4 border-b-4 border-black bg-white flex items-center justify-between">
          <h2 style={{ fontFamily: "Bangers, cursive", fontSize: "28px", letterSpacing: "0.05em", color: "#0D0D0D" }}>YOUR LOOT ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-[#C8181E] hover:text-white border-2 border-transparent hover:border-black transition-colors rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <p className="font-bold text-lg">Your cart is empty</p>
              <p className="text-sm">Grab some comics to fill it up!</p>
            </div>
          ) : (
            cart.map((c) => (
              <div key={c._id || c.id} className="flex gap-4 border-2 border-black bg-white p-2 relative pr-10" style={{ boxShadow: "4px 4px 0 #0D0D0D" }}>
                <img src={c.img || '/placeholder.jpg'} alt={c.title} className="w-16 h-24 object-cover border-2 border-black" />
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-black leading-tight mb-1">{c.title}</p>
                  <p className="text-xs text-[#6B5B45] font-bold uppercase">{c.badge || "Single Issue"}</p>
                  <p style={{ fontFamily: "Bangers, cursive", fontSize: "20px", marginTop: "4px" }}>₹{c.price}</p>
                </div>
                <button onClick={() => removeFromCart(c._id || c.id || "")} className="absolute top-2 right-2 p-1.5 hover:bg-[#C8181E] hover:text-white border-2 border-transparent hover:border-black transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-white border-t-4 border-black">
            <div className="flex justify-between items-end mb-4">
              <span className="font-bold text-sm uppercase tracking-widest text-[#6B5B45]">Total</span>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "36px", lineHeight: 1 }}>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#F5C518] text-black px-6 py-4 font-bold border-4 border-black hover:bg-[#C8181E] hover:text-white transition-colors"
              style={{ fontFamily: "Bangers, cursive", fontSize: "22px", letterSpacing: "0.05em", boxShadow: "4px 4px 0 #0D0D0D" }}
            >
              SECURE CHECKOUT <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
