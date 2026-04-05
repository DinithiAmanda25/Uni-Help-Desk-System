import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Eye, Star, Tag, User, Calendar, FileText, BookOpen, Share2, BookmarkPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { resourceAPI } from "../../../services/api";

const colorPalette = [
  "from-blue-400 to-cyan-400", "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500", "from-amber-400 to-orange-400",
];

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await resourceAPI.getById(id);
        setResource(r);

        // Fetch related (same category)
        const rel = await resourceAPI.getAll({ category: r.category, limit: 3 });
        setRelated((rel.resources || []).filter(x => x._id !== id).slice(0, 3));
      } catch {
        toast.error("Could not load resource");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDownload = async () => {
    try {
      await resourceAPI.recordDownload(resource._id);
      window.open(`http://localhost:5000/${resource.fileUrl}`, "_blank");
      toast.success(`Downloading "${resource.title}"...`);
    } catch {
      toast.error("Download failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!resource) return null;

  const color = colorPalette[0];
  const uploaderName = resource.uploadedBy?.name || "Unknown";
  const uploaderInitials = uploaderName.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Resources
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero */}
          <div className={`relative bg-gradient-to-br ${color} rounded-2xl p-8 flex items-center gap-6`}>
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
              <BookOpen size={36} className="text-white" />
            </div>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{resource.fileType}</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">{resource.accessLevel}</span>
              </div>
              <h1 className="text-xl font-bold">{resource.title}</h1>
              <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                <User size={13} /> {uploaderName} • {resource.category}
              </p>
            </div>
            <div className="absolute bottom-4 right-6 flex items-center gap-1 text-white">
              <Star size={14} fill="currentColor" />
              <span className="font-bold text-sm">{resource.rating?.toFixed(1) || "—"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{resource.description || "No description provided."}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {(resource.tags || []).map(t => (
                <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Resource Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "File Size", value: resource.fileSize || "—", icon: FileText },
                { label: "Version", value: resource.version || "1.0", icon: FileText },
                { label: "Downloads", value: (resource.downloads || 0).toLocaleString(), icon: Download },
                { label: "Views", value: (resource.views || 0).toLocaleString(), icon: Eye },
                { label: "Upload Date", value: new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), icon: Calendar },
                { label: "Access Level", value: resource.accessLevel, icon: User },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">{label}</p>
                    <p className="text-xs font-semibold text-gray-700 capitalize">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Resources */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Related Resources</h2>
              <div className="space-y-3">
                {related.map((r, i) => (
                  <div
                    key={r._id}
                    onClick={() => navigate(`/student/resources/${r._id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorPalette[i % colorPalette.length]} flex items-center justify-center shrink-0`}>
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">{r.title}</p>
                      <p className="text-xs text-gray-400">{r.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={11} fill="currentColor" />
                      <span className="text-xs font-semibold text-gray-600">{r.rating?.toFixed(1) || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(resource.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="font-bold text-gray-800">{resource.rating?.toFixed(1) || "—"}</span>
              <span className="text-xs text-gray-400">/ 5.0</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
              <Download size={11} /> {(resource.downloads || 0).toLocaleString()} downloads
            </p>
            <button onClick={handleDownload} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-2">
              <Download size={16} /> Download
            </button>
            <button onClick={() => navigate(`/student/reader/${resource._id}`)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 mb-2">
              <Eye size={16} /> Read Online
            </button>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Saved to bookmarks")} className="flex-1 bg-gray-50 hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 font-medium py-2.5 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 text-sm">
                <BookmarkPlus size={14} /> Save
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="flex-1 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium py-2.5 rounded-xl transition-all border border-gray-200 flex items-center justify-center gap-2 text-sm">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* Uploader info */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Uploaded by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {uploaderInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{uploaderName}</p>
                <p className="text-xs text-gray-400 capitalize">{resource.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <Calendar size={11} /> Uploaded on {new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
