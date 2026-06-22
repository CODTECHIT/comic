import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../../context/AppContext';

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, setIsCartOpen, profile } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Browse", path: "/browse" },
    { label: "Plans", path: "/plans" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D] border-b-4 border-[#C8181E]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <img src="/logo.jpeg" alt="Lekhyas Studio" className="w-20 h-20 rounded-full object-cover border-[3px] border-[#F5C518] shadow-lg shadow-[#F5C518]/20 transition-transform group-hover:scale-105" />
            <div className="hidden sm:block">
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.08em", color: "#FFFFFF" }}>LEKHYAS</span>
              <span style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.08em", color: "#F5C518" }}> STUDIO</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.path}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${location.pathname === l.path ? "text-[#F5C518]" : "text-white hover:text-[#F5C518]"}`}
                style={{ fontFamily: "Bangers, cursive", fontSize: "16px", letterSpacing: "0.06em" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/browse")} className="p-2 text-white hover:text-[#F5C518] transition-colors"><Search size={20} /></button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-white hover:text-[#F5C518] transition-colors relative">
              <ShoppingCart size={20} />
              {cart && cart.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C8181E] rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            {profile ? (
              <button onClick={() => navigate("/dashboard")} className="hidden sm:flex items-center gap-1 bg-[#C8181E] border-2 border-[#C8181E] hover:bg-white hover:text-[#C8181E] text-white px-3 py-1 text-sm font-bold transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
                <User size={14} /> DASHBOARD
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="hidden sm:flex items-center gap-1 bg-[#C8181E] border-2 border-[#C8181E] hover:bg-white hover:text-[#C8181E] text-white px-3 py-1 text-sm font-bold transition-colors" style={{ fontFamily: "Bangers, cursive", fontSize: "15px", letterSpacing: "0.04em" }}>
                <User size={14} /> LOGIN
              </button>
            )}
            <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t-2 border-[#333] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.path} onClick={() => setMobileOpen(false)}
              className="text-left px-2 py-2 text-white hover:text-[#F5C518] font-bold uppercase tracking-wider text-sm"
              style={{ fontFamily: "Bangers, cursive", fontSize: "18px" }}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {profile ? (
              <button onClick={() => { navigate("/dashboard"); setMobileOpen(false); }} className="flex-1 bg-[#C8181E] text-white py-2 text-center font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>DASHBOARD</button>
            ) : (
              <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="flex-1 bg-[#C8181E] text-white py-2 text-center font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "16px" }}>LOGIN</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
