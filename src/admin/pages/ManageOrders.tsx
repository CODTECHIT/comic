import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

export function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi(`${API_URL}/orders/all`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, []);

  const totalRevenuePaise = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalRevenueINR = (totalRevenuePaise / 100).toLocaleString("en-IN");

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="text-red-600" />
            Orders & Sales
          </h1>
          <p className="text-slate-500 mt-1">Review all recent purchases and global revenue.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500">Total Lifetime Revenue</p>
          <p className="text-3xl font-bold text-green-600">₹{totalRevenueINR}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No orders found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-xs font-mono text-slate-500">{order.razorpayOrderId}</td>
                  <td className="p-4 text-slate-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-slate-900">
                    {order.user?.username || "Unknown"}
                    <div className="text-xs font-normal text-slate-500">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {order.itemType === "comic" ? (
                      <span className="font-semibold text-slate-800">{order.comicId?.title || "Comic"}</span>
                    ) : (
                      <span className="text-[#C8181E] font-bold">{order.subscriptionName} Plan</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">
                    ₹{(order.amount / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
