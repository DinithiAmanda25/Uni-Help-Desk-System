const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  reserveBook,
  getMyReservations,
  returnBook,
} = require("../controllers/libraryController");

// ⚠️  IMPORTANT: specific named routes MUST come before the /:id wildcard
// to avoid Express matching "user" or "reserve" as a book ID.

// GET  /api/books/user/my-books  (authenticated) — must be before /:id
router.get("/user/my-books", auth, getMyReservations);

// GET  /api/books
router.get("/", getAllBooks);

// GET  /api/books/:id
router.get("/:id", getBookById);

// POST /api/books  (admin only)
router.post("/", auth, authorize("admin"), createBook);

// PUT  /api/books/:id  (admin only)
router.put("/:id", auth, authorize("admin"), updateBook);

// DELETE /api/books/:id  (admin only)
router.delete("/:id", auth, authorize("admin"), deleteBook);

// POST /api/books/reserve/:bookId  (authenticated)
router.post("/reserve/:bookId", auth, reserveBook);

// PUT  /api/books/return/:reservationId  (authenticated)
router.put("/return/:reservationId", auth, returnBook);

module.exports = router;
