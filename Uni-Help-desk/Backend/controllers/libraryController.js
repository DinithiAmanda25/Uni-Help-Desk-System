const Book = require("../models/Book");
const Reservation = require("../models/Reservation");
const Notification = require("../models/Notification");

/**
 * GET /api/books
 */
exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, available } = req.query;
    const query = {};

    if (search)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    if (category) query.category = category;
    if (available === "true") query.availableCopies = { $gt: 0 };

    const books = await Book.find(query).sort({ title: 1 });
    res.json(books);
  } catch (err) {
    console.error("getAllBooks error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/books/:id
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (err) {
    console.error("getBookById error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/books  (admin only)
 */
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, location, coverImage, description } =
      req.body;
    if (!title || !author || !category || !totalCopies)
      return res
        .status(400)
        .json({ message: "title, author, category and totalCopies are required." });

    const book = new Book({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies, // all copies available on creation
      location,
      coverImage,
      description,
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error("createBook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/books/:id  (admin only)
 */
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (err) {
    console.error("updateBook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/books/:id  (admin only)
 */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted successfully." });
  } catch (err) {
    console.error("deleteBook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/books/reserve/:bookId  (authenticated)
 */
exports.reserveBook = async (req, res) => {
  try {
    const { pickupDate, duration } = req.body;
    if (!pickupDate || !duration)
      return res.status(400).json({ message: "pickupDate and duration are required." });

    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });
    if (book.availableCopies <= 0)
      return res.status(400).json({ message: "No copies available." });

    // Per-role active loan limits
    const activeCount = await Reservation.countDocuments({
      userId: req.user.id,
      status: { $in: ["pending", "active"] },
    });
    const limit = req.user.role === "lecturer" ? 10 : 3;
    if (activeCount >= limit)
      return res
        .status(400)
        .json({ message: `You can only have ${limit} active loans at a time.` });

    const returnDate = new Date(pickupDate);
    returnDate.setDate(returnDate.getDate() + Number(duration));

    const reservation = new Reservation({
      userId: req.user.id,
      bookId: book._id,
      pickupDate,
      returnDate,
      duration,
    });
    await reservation.save();

    book.availableCopies -= 1;
    await book.save();

    await Notification.create({
      userId: req.user.id,
      title: "Reservation Confirmed",
      message: `Your reservation for "${book.title}" is confirmed. Pickup by ${new Date(
        pickupDate
      ).toLocaleDateString()}.`,
      type: "reservation",
      relatedId: reservation._id,
      relatedModel: "Reservation",
    });

    res.status(201).json(reservation);
  } catch (err) {
    console.error("reserveBook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/books/user/my-books  (authenticated)
 */
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("bookId", "title author isbn coverImage category");
    res.json(reservations);
  } catch (err) {
    console.error("getMyReservations error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/books/return/:reservationId  (authenticated)
 */
exports.returnBook = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.reservationId).populate("bookId");
    if (!reservation) return res.status(404).json({ message: "Reservation not found." });

    if (
      reservation.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ message: "Not authorized." });

    if (reservation.status === "returned")
      return res.status(400).json({ message: "Book already returned." });

    const now = new Date();
    const returnDate = new Date(reservation.returnDate);
    let fine = 0;
    if (now > returnDate) {
      const overdueDays = Math.ceil((now - returnDate) / (1000 * 60 * 60 * 24));
      fine = overdueDays * 5; // Rs.5 per day – configurable
    }

    reservation.actualReturnDate = now;
    reservation.status = "returned";
    reservation.fine = fine;
    await reservation.save();

    reservation.bookId.availableCopies += 1;
    await reservation.bookId.save();

    if (fine > 0) {
      const overdueDays = Math.ceil((now - returnDate) / (1000 * 60 * 60 * 24));
      await Notification.create({
        userId: req.user.id,
        title: "Book Returned — Fine Applied",
        message: `"${reservation.bookId.title}" returned ${overdueDays} days late. Fine: Rs.${fine}.`,
        type: "fine",
        relatedId: reservation._id,
        relatedModel: "Reservation",
      });
    }

    res.json({ reservation, fine });
  } catch (err) {
    console.error("returnBook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
