import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";
import { Check, Mail, MessageSquare, Phone } from "lucide-react";

export function ManageContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`${API_URL}/admin/contacts`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
      });
      if (res.ok) {
        setContacts(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetchApi(`${API_URL}/admin/contacts/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}` 
        },
        body: JSON.stringify({ status: "read" })
      });
      if (res.ok) {
        setContacts(contacts.map(c => c._id === id ? { ...c, status: "read" } : c));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({ ...selectedMessage, status: "read" });
        }
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Contacts & Inquiries</h1>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Message Snippet</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {contacts.map((contact) => (
              <tr key={contact._id} className={contact.status === "unread" ? "bg-blue-50/50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{contact.name}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Mail size={12} /> {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Phone size={12} /> {contact.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700 line-clamp-2 max-w-xs">{contact.message}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => {
                      setSelectedMessage(contact);
                      if (contact.status === "unread") markAsRead(contact._id);
                    }}
                    className="text-[#C8181E] hover:text-red-900"
                  >
                    View
                  </button>
                  {contact.status === "unread" && (
                    <button onClick={() => markAsRead(contact._id)} className="text-slate-400 hover:text-slate-600" title="Mark as read">
                      <Check size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && contacts.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No contact inquiries found</td></tr>
            )}
            {loading && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading inquiries...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Message from {selectedMessage.name}</h3>
                <div className="flex gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</span>
                  {selectedMessage.phone && <span className="flex items-center gap-1"><Phone size={14} /> {selectedMessage.phone}</span>}
                </div>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{selectedMessage.message}</p>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
