import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";

export function AdminDashboard() {
  const [stats, setStats] = useState({ comics: 0, categories: 0, subscriptions: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/comics`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/categories`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/subscriptions`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/orders/all`, { headers: { "Authorization": `Bearer ${adminToken}` } }).then(r => r.ok ? r.json() : []),
    ]).then(([comics, cats, subs, ords]) => {
      setStats({
        comics: comics.length,
        categories: cats.length,
        subscriptions: subs.length
      });
      setOrders(Array.isArray(ords) ? ords : []);
    }).catch(err => console.error("Error fetching dashboard stats", err));
  }, []);

  const totalRevenuePaise = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalRevenueINR = (totalRevenuePaise / 100).toLocaleString("en-IN");
  
  // Group orders by week for the chart
  const last4Weeks = [
    { name: "Week 1", revenue: 0 },
    { name: "Week 2", revenue: 0 },
    { name: "Week 3", revenue: 0 },
    { name: "Week 4", revenue: 0 }
  ];
  const now = new Date();
  orders.forEach(order => {
    const d = new Date(order.createdAt);
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // amount is in paise, chart uses INR
    const rev = (order.amount || 0) / 100;
    if (diffDays <= 7) last4Weeks[3].revenue += rev;
    else if (diffDays <= 14) last4Weeks[2].revenue += rev;
    else if (diffDays <= 21) last4Weeks[1].revenue += rev;
    else if (diffDays <= 28) last4Weeks[0].revenue += rev;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Revenue (Lifetime)" value={`₹${totalRevenueINR}`} trend="+0%" positive />
        <KPICard title="Active Subscribers" value={stats.subscriptions.toString()} trend="+5%" positive />
        <KPICard title="Comics Published" value={stats.comics.toString()} trend="0%" />
        <KPICard title="Categories" value={stats.categories.toString()} trend="+1%" positive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Revenue Overview</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last4Weeks} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ fill: "#F1F5F9" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="revenue" fill="#C8181E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm overflow-y-auto max-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
          </div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-sm text-slate-500">No orders yet.</div>
            ) : (
              orders.slice(0, 10).map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{order.user?.username || "Unknown"}</p>
                    <p className="text-xs text-slate-500">
                      {order.itemType === "comic" ? order.comicId?.title : `${order.subscriptionName} Plan`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">₹{(order.amount / 100).toLocaleString("en-IN")}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, positive }: { title: string; value: string; trend: string; positive?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend !== "0%" && (
          <span className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
