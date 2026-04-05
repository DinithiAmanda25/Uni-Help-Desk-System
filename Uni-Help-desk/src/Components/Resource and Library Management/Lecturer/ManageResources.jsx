import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Globe, Lock, Users, Download, Eye, FileText, BookOpen, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { resourceAPI } from "../../../services/api";

const accessIcon = { public: Globe, private: Lock, role: Users };
const accessColor = { public: "text-emerald-500 bg-emerald-50", private: "text-gray-500 bg-gray-100", role: "text-blue-500 bg-blue-50" };

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Fetch all my resources (lecturers see their own via auth)
      const data = await resourceAPI.getAll({ limit: 50 });
      setResources(data.resources || []);
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource permanently?")) return;
    try {
      await resourceAPI.delete(id);
      setResources(resources.filter(r => r._id !== id));
      toast.success("Resource deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleSaveEdit = async (id) => {
    setSaving(true);
    try {
      const updated = await resourceAPI.update(id, { title: editTitle });
      setResources(resources.map(r => r._id === id ? updated : r));
      setEditingId(null);
      toast.success("Resource updated");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Resources</h1>
        <p className="text-sm text-gray-400 mt-1">Edit, delete, or update your uploaded materials</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Uploads", value: resources.length, color: "text-violet-600 bg-violet-50" },
          { label: "Published", value: resources.filter(r => r.status === "published").length, color: "text-emerald-600 bg-emerald-50" },
          { label: "Drafts", value: resources.filter(r => r.status === "draft").length, color: "text-amber-600 bg-amber-50" },
          { label: "Total Downloads", value: resources.reduce((a, r) => a + (r.downloads || 0), 0).toLocaleString(), color: "text-blue-600 bg-blue-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 ${color} border border-current/10`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-1 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-violet-300 shadow-sm"
          />
        </div>
        {["All", "published", "draft"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border capitalize transition-all ${statusFilter === s ? "bg-violet-500 text-white border-violet-500" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-violet-400 animate-spin" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Resource</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Access</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Stats</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Version</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const AccessIcon = accessIcon[r.accessLevel] || Globe;
                  return (
                    <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        {editingId === r._id ? (
                          <div className="flex gap-2">
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 text-sm px-2 py-1 border border-violet-300 rounded-lg outline-none"
                            />
                            <button onClick={() => handleSaveEdit(r._id)} disabled={saving} className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-lg disabled:opacity-50">
                              {saving ? "..." : "Save"}
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                              <FileText size={15} className="text-violet-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                              <p className="text-xs text-gray-400">{r.category} · {r.fileSize || "—"}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{r.fileType}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg w-fit ${accessColor[r.accessLevel] || "text-gray-500 bg-gray-100"}`}>
                          <AccessIcon size={11} /> {r.accessLevel}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <div className="flex items-center gap-1"><Download size={10} /> {(r.downloads || 0).toLocaleString()} downloads</div>
                          <div className="flex items-center gap-1"><Eye size={10} /> {(r.views || 0).toLocaleString()} views</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${r.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{r.version || "1.0"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditingId(r._id); setEditTitle(r.title); }} className="p-2 rounded-xl hover:bg-violet-50 text-gray-400 hover:text-violet-500 transition-colors">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => handleDelete(r._id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No resources found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
