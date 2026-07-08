import { Outlet, Navigate, NavLink } from "react-router";
import { LogOut, LayoutDashboard, BookOpen, ListOrdered, Crown, ShoppingCart, Settings, Image, MessageSquare, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";

export function AdminLayout() {
  const [authState, setAuthState] = useState<"loading" | "authed" | "unauthed">("loading");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAuthState("unauthed");
      return;
    }
    // Verify token is still valid against the server
    fetch(`${API_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => setAuthState(r.ok ? "authed" : "unauthed"))
      .catch(() => setAuthState("unauthed"));
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-slate-500 font-medium">Verifying access...</p>
      </div>
    );
  }

  if (authState === "unauthed") return <Navigate to="/admin/comic/login" replace />;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/comic/login";
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-slate-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-24 flex items-center px-6 border-b border-slate-200">
          <img src="/logo.jpeg" alt="Logo" className="w-16 h-16 rounded object-cover mr-4 shadow-sm border border-slate-200" />
          <span className="font-bold text-xl tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/admin/comic/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/admin/comic/comics" icon={<BookOpen size={20} />} label="Manage Comics" />
          <NavItem to="/admin/comic/categories" icon={<ListOrdered size={20} />} label="Categories" />
          <NavItem to="/admin/comic/subscriptions" icon={<Crown size={20} />} label="Subscriptions" />
          <NavItem to="/admin/comic/orders" icon={<ShoppingCart size={20} />} label="Orders & Sales" />
          <NavItem to="/admin/comic/comments" icon={<MessageSquare size={20} />} label="Comments" />
          <NavItem to="/admin/comic/contacts" icon={<Mail size={20} />} label="Contacts & Inquiries" />
          <NavItem to="/admin/comic/homepage" icon={<Image size={20} />} label="Homepage Hero" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="font-semibold text-lg text-slate-800">Lekhyas Studio</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">A</div>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors" title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
          isActive ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
