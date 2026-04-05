import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, ChevronRight, User, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { libraryAPI } from "../../../services/api";

const categories = ["All", "Computer Science", "Web Development", "Software Engineering", "Data Science"];
const colorPalette = [
  "from-sky-400 to-blue-500", "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500", "from-amber-400 to-orange-400",
  "from-teal-400 to-emerald-500", "from-fuchsia-400 to-pink-500",
  "from-orange-400 to-red-400", "from-lime-400 to-green-500",
  "from-indigo-400 to-blue-500",
];

export default function LibraryCatalog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filter, setFilter] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, filter]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (filter === "Available") params.available = "true";
      const data = await libraryAPI.getBooks(params);
      let result = Array.isArray(data) ? data : [];
      if (filter === "Unavailable") result = result.filter(b => b.availableCopies === 0);
      setBooks(result);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book Catalog</h1>
        <p className="text-sm text-gray-400 mt-1">Browse and reserve physical library books</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Books", value: books.length, icon: BookOpen, color: "text-blue-500 bg-blue-50" },
          { label: "Available Now", value: books.filter(b => b.availableCopies > 0).length, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
          { label: "All Reserved", value: books.filter(b => b.availableCopies === 0).length, icon: AlertCircle, color: "text-amber-500 bg-amber-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-300 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Available", "Unavailable"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  filter === f ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === c ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      )}

      {/* Book Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book, idx) => {
            const color = colorPalette[idx % colorPalette.length];
            return (
              <div key={book._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
                <div className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                  <BookOpen size={40} className="text-white/70" />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold ${
                    book.availableCopies > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies} Available` : "All Reserved"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{book.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <User size={10} /> {book.author}
                  </p>
                  <p className="text-[10px] text-blue-500 font-medium mt-1">{book.category}</p>

                  {/* Availability bar */}
                  <div className="mt-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-400">Availability</span>
                      <span className="text-[10px] font-semibold text-gray-600">{book.availableCopies}/{book.totalCopies}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${book.availableCopies === 0 ? "bg-red-400" : book.availableCopies < book.totalCopies / 2 ? "bg-amber-400" : "bg-emerald-400"}`}
                        style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                      />
                    </div>
                  </div>

                  {book.location && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
                      <Clock size={10} /> Section: {book.location}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/student/reserve/${book._id}`)}
                      disabled={book.availableCopies === 0}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        book.availableCopies > 0
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {book.availableCopies > 0 ? "Reserve Now" : "Unavailable"}
                    </button>
                    <button
                      onClick={() => toast.success(`Added "${book.title}" to watchlist`)}
                      className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-600 border border-gray-200 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No books found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
