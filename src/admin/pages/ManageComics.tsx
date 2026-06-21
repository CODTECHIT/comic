import { useState } from "react";
import { Plus, Search, MoreVertical, Edit, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router";

// Mock data
const comicsData = [
  { id: 1, title: "War-God: Son of Vayu", category: "Mythic Warriors", price: 1449, status: "Published", date: "Mar 10, 2026", img: "/images/comic-1.jpeg" },
  { id: 2, title: "Jackboy: State Rebel", category: "Action-Adventure", price: 1369, status: "Draft", date: "Apr 02, 2026", img: "/images/comic-2.jpeg" },
];

export function ManageComics() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Comics</h1>
        <button 
          onClick={() => navigate("/admin/comics/new")}
          className="bg-[#C8181E] hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add Comic
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search comics by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <select className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">All Categories</option>
            <option value="mythic">Mythic Warriors</option>
            <option value="urban">Urban Heroes</option>
          </select>
          <select className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-3">Comic</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Added</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comicsData.map((comic) => (
                <tr key={comic.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={comic.img} alt={comic.title} className="w-10 h-14 object-cover rounded border border-slate-200 shadow-sm" />
                    <span className="font-medium text-slate-900">{comic.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{comic.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">₹{comic.price.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      comic.status === "Published" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                    }`}>
                      {comic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{comic.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors" title="Delete">
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
