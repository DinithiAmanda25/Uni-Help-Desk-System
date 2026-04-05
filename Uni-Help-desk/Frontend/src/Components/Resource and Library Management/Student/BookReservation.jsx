import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, User, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { libraryAPI } from "../../../services/api";

const colorPalette = [
  "from-sky-400 to-blue-500", "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500", "from-amber-400 to-orange-400",
];

// ────────────────── helpers ──────────────────
const today = new Date().toISOString().split("T")[0];
const maxDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
})();

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

// ────────────────── component ──────────────────
export default function BookReservation() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [reserveDate, setReserveDate] = useState("");
  const [duration, setDuration] = useState("7");
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    libraryAPI.getBook(bookId)
      .then(setBook)
      .catch(() => { toast.error("Book not found"); navigate(-1); })
      .finally(() => setLoading(false));
  }, [bookId]);

  const calculateReturn = () => {
    if (!reserveDate) return "—";
    const d = new Date(reserveDate);
    d.setDate(d.getDate() + parseInt(duration));
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (!reserveDate) {
      errs.reserveDate = "Please select a pickup date.";
    } else if (reserveDate < today) {
      errs.reserveDate = "Pickup date cannot be in the past.";
    } else if (reserveDate > maxDate) {
      errs.reserveDate = "Pickup date must be within the next 60 days.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDateChange = (e) => {
    setReserveDate(e.target.value);
    if (errors.reserveDate) setErrors((prev) => ({ ...prev, reserveDate: "" }));
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await libraryAPI.reserve(bookId, {
        pickupDate: reserveDate,
        duration: parseInt(duration),
      });
      setReservationId(result._id);
      setConfirmed(true);
      toast.success("Book reserved successfully! 🎉");
    } catch (err) {
      toast.error(err.message || "Reservation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── States ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  const color = colorPalette[0];

  if (confirmed) {
    return (
      <div className="px-6 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Reservation Confirmed!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your reservation for <strong>{book.title}</strong> has been placed.
            Please collect your book from the library by{" "}
            <strong>{new Date(reserveDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</strong>.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 text-left mb-6 space-y-2">
            {[
              { label: "Reservation ID", value: `#${reservationId?.slice(-8).toUpperCase() || "—"}` },
              { label: "Pickup Date", value: new Date(reserveDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              { label: "Return Date", value: calculateReturn() },
              { label: "Location", value: book.location || "Main Library" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/student/library")} className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-100 transition-all text-sm">
              Back to Catalog
            </button>
            <button onClick={() => navigate("/student/dashboard")} className="flex-1 bg-blue-500 text-white font-medium py-2.5 rounded-xl hover:bg-blue-600 transition-all text-sm">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reserve a Book</h1>

      {/* Book card */}
      <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 flex items-center gap-4 mb-6 text-white shadow-lg`}>
        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <BookOpen size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-white/80 text-sm flex items-center gap-1"><User size={12} /> {book.author}</p>
          {book.isbn && <p className="text-white/60 text-xs mt-1">ISBN: {book.isbn}</p>}
        </div>
        <div className="ml-auto text-right">
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            {book.availableCopies > 0 ? `${book.availableCopies} Available` : "Waitlist"}
          </div>
        </div>
      </div>

      {book.availableCopies === 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5 text-sm text-amber-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>This book is currently unavailable. Reserve to join the waitlist.</span>
        </div>
      )}

      {/* Reservation form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Borrowing Duration</label>
          <div className="grid grid-cols-3 gap-3">
            {[{ days: "7", label: "7 days" }, { days: "14", label: "14 days" }, { days: "21", label: "21 days" }].map(({ days, label }) => (
              <button
                key={days}
                onClick={() => setDuration(days)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                  duration === days ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pickup Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={today}
            max={maxDate}
            value={reserveDate}
            onChange={handleDateChange}
            className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl outline-none transition-all ${
              errors.reserveDate ? "border-red-400 focus:border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-300"
            }`}
          />
          <FieldError msg={errors.reserveDate} />
          <p className="text-[11px] text-gray-400 mt-1">Available range: today – next 60 days</p>
        </div>

        {/* Summary */}
        {reserveDate && !errors.reserveDate && (
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Reservation Summary</h3>
            {[
              { label: "Book", value: book.title },
              { label: "Pickup Date", value: new Date(reserveDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              { label: "Return Date", value: calculateReturn() },
              { label: "Duration", value: `${duration} days` },
              { label: "Location", value: book.location || "Main Library" },
              { label: "Fine Policy", value: "₹5/day for overdue books" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {submitting
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Reserving...</>
            : <><Calendar size={16} /> Confirm Reservation</>
          }
        </button>
      </div>
    </div>
  );
}
