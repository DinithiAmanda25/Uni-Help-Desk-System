import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, BookOpen, User, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { libraryAPI } from "../../../services/api";

const categories = ["Computer Science", "Web Development", "Software Engineering", "Data Science", "Mathematics"];

export default function LibraryManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "", category: "Computer Science", totalCopies: 1, availableCopies: 1, location: "" });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await libraryAPI.getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this book from the catalog?")) return;
    try {
      await libraryAPI.deleteBook(id);
      setBooks(books.filter(b => b._id !== id));
      toast.success("Book removed from catalog");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleAvailChange = async (id, delta) => {
    const book = books.find(b => b._id === id);
    if (!book) return;
    const newAvail = Math.max(0, Math.min(book.totalCopies, book.availableCopies + delta));
    try {
      const updated = await libraryAPI.updateBook(id, { availableCopies: newAvail });
      setBooks(books.map(b => b._id === id ? updated : b));
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) { toast.error("Title and author are required"); return; }
    setSaving(true);
    try {
      const created = await libraryAPI.addBook({
        ...newBook,
        totalCopies: parseInt(newBook.totalCopies),
        availableCopies: parseInt(newBook.availableCopies),
      });
      setBooks([...books, created]);
      setShowAddModal(false);
      setNewBook({ title: "", author: "", isbn: "", category: "Computer Science", totalCopies: 1, availableCopies: 1, location: "" });
      toast.success("Book added to catalog!");
    } catch (err) {
      toast.error(err.message || "Add failed. Are you logged in as admin?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Library Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage book catalog and inventory</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md text-sm">
          <Plus size={16} /> Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Books", value: books.length },
          { label: "Total Copies", value: books.reduce((a, b) => a + (b.totalCopies || 0), 0) },
          { label: "Available Copies", value: books.reduce((a, b) => a + (b.availableCopies || 0), 0), color: "text-emerald-600 bg-emerald-50" },
          { label: "Borrowed Out", value: books.reduce((a, b) => a + ((b.totalCopies || 0) - (b.availableCopies || 0)), 0), color: "text-blue-600 bg-blue-50" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-4 border border-gray-100 bg-white shadow-sm ${color || "text-gray-700"}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-300 shadow-sm" />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="text-amber-400 animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((book) => (
            <div key={book._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <BookOpen size={18} className="text-amber-500" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${book.availableCopies > 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                  {book.availableCopies > 0 ? <><CheckCircle2 size={10} className="inline mr-0.5" />Available</> : <><AlertCircle size={10} className="inline mr-0.5" />Reserved</>}
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 text-sm mb-0.5">{book.title}</h3>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User size={10} /> {book.author}</p>
              <p className="text-[10px] text-blue-500 font-medium mb-1">{book.category}</p>
              {book.isbn && <p className="text-[10px] text-gray-400 mb-3">ISBN: {book.isbn}</p>}
              {book.location && <p className="text-[10px] text-gray-400 mb-3">Location: {book.location}</p>}

              {/* Inventory control */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Copies Available</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAvailChange(book._id, -1)} disabled={book.availableCopies === 0}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors flex items-center justify-center">−</button>
                    <span className="text-sm font-bold text-gray-800 w-8 text-center">{book.availableCopies}/{book.totalCopies}</span>
                    <button onClick={() => handleAvailChange(book._id, 1)} disabled={book.availableCopies === book.totalCopies}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 disabled:opacity-40 transition-colors flex items-center justify-center">+</button>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${book.availableCopies === 0 ? "bg-red-400" : "bg-emerald-400"}`}
                    style={{ width: `${((book.availableCopies || 0) / (book.totalCopies || 1)) * 100}%` }} />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toast.info("Edit book — coming in next update")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 border border-gray-200 hover:border-amber-200 transition-all">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(book._id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Add New Book</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} className="text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Title", key: "title", placeholder: "Book title" },
                { label: "Author", key: "author", placeholder: "Author name" },
                { label: "ISBN", key: "isbn", placeholder: "978-..." },
                { label: "Location", key: "location", placeholder: "e.g. Section A, Shelf 3" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input value={newBook[key]} onChange={(e) => setNewBook({ ...newBook, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Copies</label>
                  <input type="number" min="1" value={newBook.totalCopies} onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Available</label>
                  <input type="number" min="0" value={newBook.availableCopies} onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={handleAddBook} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</> : <><Plus size={15} /> Add Book</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
