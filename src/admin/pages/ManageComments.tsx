import { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff, MessageSquare } from "lucide-react";
import { API_URL } from "../../config/api";
import { fetchApi } from "../../lib/apiClient";

export function ManageComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetchApi(`${API_URL}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const adminToken = localStorage.getItem("adminToken");

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "approved" ? "hidden" : "approved";
    try {
      const res = await fetchApi(`${API_URL}/comments/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComments(comments.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
      } else {
        alert("Failed to update status. Are you authorized?");
      }
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetchApi(`${API_URL}/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        setComments(comments.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete comment. Are you authorized?");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-red-600" />
            Manage Comments
          </h1>
          <p className="text-slate-500 mt-1">Review, approve, hide, and delete user comments.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No comments found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Comic</th>
                <th className="p-4 font-medium">Comment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{comment.userName}</td>
                  <td className="p-4 text-slate-600">
                    {comment.comicId?.title || "Site Comment"}
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs truncate" title={comment.text}>
                    {comment.text}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        comment.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {comment.status === "approved" ? "Approved" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(comment._id, comment.status)}
                        className={`p-2 rounded hover:bg-slate-200 ${
                          comment.status === "approved" ? "text-slate-600" : "text-green-600"
                        }`}
                        title={comment.status === "approved" ? "Hide Comment" : "Approve Comment"}
                      >
                        {comment.status === "approved" ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Comment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
