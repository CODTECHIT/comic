import { useState, useEffect } from "react";
import { Save, Edit2, X } from "lucide-react";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

export function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetchApi(`${API_URL}/subscriptions`);
      if (res.ok) setSubscriptions(await res.json());
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    }
  };

  const handleEdit = (sub: any) => {
    setEditingId(sub._id);
    setEditForm({
      price: sub.price,
      description: sub.description || "",
      features: sub.features ? sub.features.join("\n") : "",
      is_active: sub.is_active,
      is_popular: sub.is_popular,
      display_order: sub.display_order,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: string) => {
    setIsSubmitting(true);
    try {
      const featuresArray = editForm.features.split("\n").map((f: string) => f.trim()).filter((f: string) => f);
      const res = await fetchApi(`${API_URL}/subscriptions/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({ 
          price: Number(editForm.price), 
          description: editForm.description,
          features: featuresArray,
          is_active: editForm.is_active,
          is_popular: editForm.is_popular,
          display_order: Number(editForm.display_order)
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchSubscriptions();
      } else {
        alert("Failed to update plan");
      }
    } catch (err) {
      console.error("Failed to update subscription", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Memberships</h1>
      <p className="text-slate-600">The 4 core membership plans are fixed. You can only edit their details.</p>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {subscriptions.map((sub) => (
              <tr key={sub._id} className={!sub.is_active ? "bg-slate-50 opacity-70" : ""}>
                {editingId === sub._id ? (
                  <td colSpan={5} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-1">Plan Name (Fixed)</label>
                        <input disabled value={sub.name} className="border p-2 rounded w-full bg-slate-100" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Price</label>
                        <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="border p-2 rounded w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Description</label>
                        <input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border p-2 rounded w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1">Display Order</label>
                        <input type="number" value={editForm.display_order} onChange={e => setEditForm({...editForm, display_order: e.target.value})} className="border p-2 rounded w-full" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-1">Features (one per line)</label>
                        <textarea rows={4} value={editForm.features} onChange={e => setEditForm({...editForm, features: e.target.value})} className="border p-2 rounded w-full font-mono text-sm" />
                      </div>
                      <div className="flex items-center gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editForm.is_active} onChange={e => setEditForm({...editForm, is_active: e.target.checked})} />
                          <span className="text-sm font-bold">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editForm.is_popular} onChange={e => setEditForm({...editForm, is_popular: e.target.checked})} />
                          <span className="text-sm font-bold">Mark as Popular</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button onClick={handleCancel} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <X size={16} /> Cancel
                      </button>
                      <button onClick={() => handleSave(sub._id)} disabled={isSubmitting} className="bg-[#C8181E] text-white px-4 py-2 rounded flex items-center gap-2">
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="font-bold">{sub.name}</div>
                      <div className="text-xs text-slate-500">{sub.duration_months} Months Duration</div>
                      {sub.is_popular && <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded mt-1 font-bold">POPULAR</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-green-700">₹{sub.price}</td>
                    <td className="px-6 py-4">{sub.display_order}</td>
                    <td className="px-6 py-4">
                      {sub.is_active ? 
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Active</span> : 
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">Inactive</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(sub)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 size={16} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No subscriptions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
