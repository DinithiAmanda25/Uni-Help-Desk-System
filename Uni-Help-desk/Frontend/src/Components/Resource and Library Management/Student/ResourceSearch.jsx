import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, Download, Eye, Star, BookOpen, ChevronDown,
  X, SlidersHorizontal, FileText, Video, ImageIcon, Tag, Loader2,
} from "lucide-react";
import { resourceAPI } from "../../../services/api";
import toast from "react-hot-toast";

const categories = ["All", "Computer Science", "Web Development", "Data Science", "Software Engineering", "Mathematics", "Physics"];
const types = ["All Types", "PDF", "EPUB", "Video", "PPT", "DOC"];
const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest First", value: "newest" },
  { label: "Highest Rated", value: "rated" },
];

const typeIcon = { PDF: FileText, EPUB: BookOpen, Video: Video, PPT: SlidersHorizontal, DOC: FileText, Image: ImageIcon };
const colorPalette = [
  "from-blue-400 to-cyan-400", "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500", "from-amber-400 to-orange-400",
  "from-teal-400 to-emerald-400", "from-sky-400 to-blue-500",
  "from-fuchsia-400 to-purple-500", "from-lime-400 to-green-500",
];

export default function ResourceSearch() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => fetchResources(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedType, sortBy]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = { sort: sortBy, limit: 20 };
      if (search) params.search = search;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedType !== "All Types") params.type = selectedType;
      const data = await resourceAPI.getAll(params);
      setResources(data.resources || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e, resource) => {
    e.stopPropagation();
    try {
      await resourceAPI.recordDownload(resource._id);
      window.open(`http://localhost:5000/${resource.fileUrl}`, "_blank");
      toast.success(`Downloading "${resource.title}"`);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resource Library</h1>
        <p className="text-sm text-gray-400 mt-1">Discover and download educational materials</p>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, tags, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-300 focus:bg-white transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-300 cursor-pointer"
              >
                {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === c ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">File Type</p>
              <div className="flex flex-wrap gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selectedType === t ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{resources.length}</span> of {total} results
          {search && <span> for "<span className="text-blue-600">{search}</span>"</span>}
        </p>
        {(selectedCategory !== "All" || selectedType !== "All Types") && (
          <button
            onClick={() => { setSelectedCategory("All"); setSelectedType("All Types"); }}
            className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      )}

      {/* Resource Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {resources.map((r, idx) => {
            const TypeIcon = typeIcon[r.fileType] || FileText;
            const color = colorPalette[idx % colorPalette.length];
            return (
              <div
                key={r._id}
                onClick={() => navigate(`/student/resources/${r._id}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <div className={`h-28 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                  <BookOpen size={36} className="text-white/70" />
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/20 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    <TypeIcon size={9} /> {r.fileType}
                  </span>
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/80">{r.fileSize}</span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors truncate">{r.title}</h3>
                  <p className="text-[11px] text-gray-400 mb-2 line-clamp-2 mt-1">{r.description}</p>
                  <p className="text-[10px] text-blue-500 font-medium mb-2">{r.category}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(r.tags || []).slice(0, 2).map(t => (
                      <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Tag size={7} /> {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[11px] font-semibold text-gray-700">{r.rating?.toFixed(1) || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Download size={11} />
                      <span className="text-[11px]">{(r.downloads || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/student/reader/${r._id}`); }}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDownload(e, r)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 text-gray-400 transition-colors"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No resources found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
