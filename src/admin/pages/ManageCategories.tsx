import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

export function ManageCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "", desc: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetchApi(`${API_URL}/categories`);
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi(`${API_URL}/categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        setNewCategory({ name: "", icon: "", desc: "" });
        fetchCategories();
      }
    } catch (err) {
      console.error("Failed to add category", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetchApi(`${API_URL}/categories/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
      });
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Add New Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required placeholder="Name (e.g. Mythic Warriors)" className="border p-2 rounded" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
          <input required placeholder="Icon (e.g. ⚔️)" className="border p-2 rounded" value={newCategory.icon} onChange={e => setNewCategory({...newCategory, icon: e.target.value})} />
          <input required placeholder="Description" className="border p-2 rounded" value={newCategory.desc} onChange={e => setNewCategory({...newCategory, desc: e.target.value})} />
        </div>
        <button disabled={isSubmitting} type="submit" className="bg-[#C8181E] text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </form>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-3">Icon</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{cat.desc}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No categories found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
