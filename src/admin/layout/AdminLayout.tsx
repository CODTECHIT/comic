import { Outlet, Navigate, NavLink } from "react-router";
import { LogOut, LayoutDashboard, Library, Tags, CreditCard, Settings, Image, Receipt } from "lucide-react";

// Mock Auth Context (we'll implement properly later, hardcoded to true for scaffolding)
const isAuthenticated = true; 

export function AdminLayout() {
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-slate-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded bg-[#C8181E] flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">Ls</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/admin/comics" icon={<Library size={18} />} label="Comics" />
          <NavItem to="/admin/categories" icon={<Tags size={18} />} label="Categories" />
          <NavItem to="/admin/subscriptions" icon={<CreditCard size={18} />} label="Subscriptions" />
          <NavItem to="/admin/orders" icon={<Receipt size={18} />} label="Orders & Sales" />
          <NavItem to="/admin/homepage" icon={<Image size={18} />} label="Homepage Hero" />
        </nav>
        <div className="p-4 border-t border-slate-200">
          <NavItem to="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="font-semibold text-lg text-slate-800">Lekhyas Studio</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">G</div>
              <span className="text-sm font-medium">Geethanjali</span>
            </div>
            <button className="text-slate-500 hover:text-red-600 transition-colors" title="Log out">
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
