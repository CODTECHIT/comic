import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Week 1", revenue: 14000 },
  { name: "Week 2", revenue: 22000 },
  { name: "Week 3", revenue: 18500 },
  { name: "Week 4", revenue: 27800 },
];

export function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Revenue (30d)" value="₹82,300" trend="+12%" positive />
        <KPICard title="Active Subscribers" value="248" trend="+5%" positive />
        <KPICard title="Comics Published" value="9" trend="0%" />
        <KPICard title="Orders (30d)" value="112" trend="-2%" positive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">User {i}</p>
                  <p className="text-xs text-slate-500">War-God: Son of Vayu</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">₹1,449</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
              </div>
            ))}
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
