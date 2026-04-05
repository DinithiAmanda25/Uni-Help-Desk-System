require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User         = require("./models/User");
const Book         = require("./models/Book");
const Resource     = require("./models/Resource");
const Reservation  = require("./models/Reservation");
const Notification = require("./models/Notification");

// ── Helper ────────────────────────────────────────────────────────────────────
const daysFromNow = (n) => new Date(Date.now() + n * 86400000);
const daysAgo     = (n) => new Date(Date.now() - n * 86400000);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected to MongoDB");

  // ── Wipe existing data ──────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Resource.deleteMany({}),
    Reservation.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log("🗑️   Cleared existing data");

  // ── Users ───────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const [admin, lecturer1, lecturer2, student1, student2, student3] =
    await User.insertMany([
      {
        name: "Admin User",
        email: "admin@university.edu",
        password: passwordHash,
        role: "admin",
        status: "active",
      },
      {
        name: "Dr. Amara Silva",
        email: "amara.silva@university.edu",
        password: passwordHash,
        role: "lecturer",
        status: "active",
      },
      {
        name: "Prof. Rajan Perera",
        email: "rajan.perera@university.edu",
        password: passwordHash,
        role: "lecturer",
        status: "active",
      },
      {
        name: "Kavya Jayawardena",
        email: "kavya@student.university.edu",
        password: passwordHash,
        role: "student",
        studentId: "STU2021001",
        status: "active",
      },
      {
        name: "Nadun Fernando",
        email: "nadun@student.university.edu",
        password: passwordHash,
        role: "student",
        studentId: "STU2021002",
        status: "active",
      },
      {
        name: "Sandali Wickramasinghe",
        email: "sandali@student.university.edu",
        password: passwordHash,
        role: "student",
        studentId: "STU2022003",
        status: "active",
      },
    ]);
  console.log("👥  Users seeded");

  // ── Books ───────────────────────────────────────────────────────────────────
  const books = await Book.insertMany([
    {
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson, Rivest, Stein",
      isbn: "978-0262033848",
      category: "Computer Science",
      totalCopies: 5,
      availableCopies: 3,
      location: "Shelf A-12",
      description: "A comprehensive introduction to the modern study of computer algorithms.",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0132350884",
      category: "Software Engineering",
      totalCopies: 4,
      availableCopies: 2,
      location: "Shelf B-07",
      description: "A handbook of agile software craftsmanship.",
    },
    {
      title: "Database System Concepts",
      author: "Silberschatz, Korth, Sudarshan",
      isbn: "978-0078022159",
      category: "Database",
      totalCopies: 6,
      availableCopies: 6,
      location: "Shelf A-03",
      description: "Widely used database textbook covering all major concepts.",
    },
    {
      title: "Operating System Concepts",
      author: "Silberschatz, Galvin, Gagne",
      isbn: "978-1119800361",
      category: "Computer Science",
      totalCopies: 4,
      availableCopies: 1,
      location: "Shelf A-15",
      description: "The definitive guide to operating systems, also known as the Dinosaur Book.",
    },
    {
      title: "Artificial Intelligence: A Modern Approach",
      author: "Russell & Norvig",
      isbn: "978-0134610993",
      category: "Artificial Intelligence",
      totalCopies: 3,
      availableCopies: 3,
      location: "Shelf C-01",
      description: "The leading textbook in AI, used in universities around the world.",
    },
    {
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      isbn: "978-0132126953",
      category: "Networking",
      totalCopies: 3,
      availableCopies: 2,
      location: "Shelf B-14",
      description: "A thorough introduction to computer networking.",
    },
    {
      title: "The Pragmatic Programmer",
      author: "Hunt & Thomas",
      isbn: "978-0135957059",
      category: "Software Engineering",
      totalCopies: 2,
      availableCopies: 0,
      location: "Shelf B-09",
      description: "From journeyman to master — timeless advice for software developers.",
    },
    {
      title: "Linear Algebra and Its Applications",
      author: "Gilbert Strang",
      isbn: "978-0030105678",
      category: "Mathematics",
      totalCopies: 5,
      availableCopies: 4,
      location: "Shelf D-02",
      description: "A complete guide to linear algebra with real-world applications.",
    },
  ]);
  console.log("📚  Books seeded");

  // ── Resources ───────────────────────────────────────────────────────────────
  const resources = await Resource.insertMany([
    {
      title: "Data Structures Lecture Notes - Week 1",
      description: "Introduction to arrays, linked lists and complexity analysis.",
      fileUrl: "/uploads/resources/ds-week1.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      category: "Computer Science",
      tags: ["data structures", "arrays", "complexity"],
      uploadedBy: lecturer1._id,
      accessLevel: "public",
      status: "published",
      downloads: 87,
      views: 210,
      rating: 4.5,
      ratingCount: 22,
    },
    {
      title: "Machine Learning Fundamentals - Slide Deck",
      description: "Covers supervised learning, regression, and classification.",
      fileUrl: "/uploads/resources/ml-fundamentals.ppt",
      fileType: "PPT",
      fileSize: "8.1 MB",
      category: "Artificial Intelligence",
      tags: ["machine learning", "regression", "classification"],
      uploadedBy: lecturer1._id,
      accessLevel: "public",
      status: "published",
      downloads: 134,
      views: 380,
      rating: 4.8,
      ratingCount: 41,
    },
    {
      title: "Database Design Principles",
      description: "Entity-relationship diagrams, normalization, and SQL basics.",
      fileUrl: "/uploads/resources/db-design.pdf",
      fileType: "PDF",
      fileSize: "3.7 MB",
      category: "Database",
      tags: ["database", "erd", "normalization", "sql"],
      uploadedBy: lecturer2._id,
      accessLevel: "public",
      status: "published",
      downloads: 95,
      views: 260,
      rating: 4.3,
      ratingCount: 18,
    },
    {
      title: "Web Development with React - Tutorial",
      description: "Step-by-step guide to building modern web apps with React and hooks.",
      fileUrl: "/uploads/resources/react-tutorial.pdf",
      fileType: "PDF",
      fileSize: "5.2 MB",
      category: "Web Development",
      tags: ["react", "javascript", "web development", "hooks"],
      uploadedBy: lecturer2._id,
      accessLevel: "public",
      status: "published",
      downloads: 201,
      views: 520,
      rating: 4.9,
      ratingCount: 63,
    },
    {
      title: "Network Security Basics",
      description: "Overview of network threats, firewalls, VPNs and encryption.",
      fileUrl: "/uploads/resources/network-security.pdf",
      fileType: "PDF",
      fileSize: "4.1 MB",
      category: "Networking",
      tags: ["security", "firewall", "encryption", "vpn"],
      uploadedBy: lecturer1._id,
      accessLevel: "public",
      status: "published",
      downloads: 62,
      views: 145,
      rating: 4.1,
      ratingCount: 11,
    },
    {
      title: "Algorithm Design Workshop - Video Lecture",
      description: "Recorded session on dynamic programming and greedy algorithms.",
      fileUrl: "/uploads/resources/algo-workshop.mp4",
      fileType: "Video",
      fileSize: "240 MB",
      category: "Computer Science",
      tags: ["algorithms", "dynamic programming", "greedy"],
      uploadedBy: lecturer2._id,
      accessLevel: "public",
      status: "published",
      downloads: 45,
      views: 310,
      rating: 4.6,
      ratingCount: 29,
    },
    {
      title: "Software Testing Strategies",
      description: "Unit testing, integration testing, and TDD practices.",
      fileUrl: "/uploads/resources/testing-strategies.pdf",
      fileType: "PDF",
      fileSize: "1.8 MB",
      category: "Software Engineering",
      tags: ["testing", "tdd", "unit test"],
      uploadedBy: lecturer1._id,
      accessLevel: "public",
      status: "draft",
      downloads: 0,
      views: 12,
      rating: 0,
      ratingCount: 0,
    },
  ]);
  console.log("📄  Resources seeded");

  // ── Reservations ─────────────────────────────────────────────────────────────
  const reservations = await Reservation.insertMany([
    {
      userId: student1._id,
      bookId: books[0]._id,  // Introduction to Algorithms
      reservedDate: daysAgo(10),
      pickupDate: daysAgo(8),
      returnDate: daysFromNow(4),
      status: "active",
      duration: 14,
      fine: 0,
      finePaid: false,
    },
    {
      userId: student1._id,
      bookId: books[1]._id,  // Clean Code
      reservedDate: daysAgo(30),
      pickupDate: daysAgo(28),
      returnDate: daysAgo(14),
      actualReturnDate: daysAgo(14),
      status: "returned",
      duration: 14,
      fine: 0,
      finePaid: false,
    },
    {
      userId: student2._id,
      bookId: books[3]._id,  // OS Concepts
      reservedDate: daysAgo(20),
      pickupDate: daysAgo(18),
      returnDate: daysAgo(4),
      status: "overdue",
      duration: 14,
      fine: 200,
      finePaid: false,
    },
    {
      userId: student2._id,
      bookId: books[6]._id,  // The Pragmatic Programmer
      reservedDate: daysAgo(3),
      pickupDate: daysFromNow(1),
      returnDate: daysFromNow(15),
      status: "pending",
      duration: 14,
      fine: 0,
      finePaid: false,
    },
    {
      userId: student3._id,
      bookId: books[4]._id,  // AI: A Modern Approach
      reservedDate: daysAgo(5),
      pickupDate: daysAgo(3),
      returnDate: daysFromNow(11),
      status: "active",
      duration: 14,
      fine: 0,
      finePaid: false,
    },
  ]);
  console.log("📅  Reservations seeded");

  // ── Notifications ─────────────────────────────────────────────────────────────
  await Notification.insertMany([
    {
      userId: student1._id,
      title: "Book Due Soon",
      message: `Your reservation for "Introduction to Algorithms" is due in 4 days.`,
      type: "due",
      readStatus: false,
      relatedId: books[0]._id,
      relatedModel: "Book",
    },
    {
      userId: student1._id,
      title: "New Resource Available",
      message: `A new resource "Machine Learning Fundamentals" has been uploaded.`,
      type: "new_resource",
      readStatus: true,
      relatedId: resources[1]._id,
      relatedModel: "Resource",
    },
    {
      userId: student2._id,
      title: "Book Overdue — Fine Applied",
      message: `Your copy of "Operating System Concepts" is overdue. A fine of Rs. 200 has been applied.`,
      type: "fine",
      readStatus: false,
      relatedId: reservations[2]._id,
      relatedModel: "Reservation",
    },
    {
      userId: student2._id,
      title: "Reservation Confirmed",
      message: `Your reservation for "The Pragmatic Programmer" has been confirmed. Pick up by tomorrow.`,
      type: "reservation",
      readStatus: false,
      relatedId: reservations[3]._id,
      relatedModel: "Reservation",
    },
    {
      userId: student3._id,
      title: "New Resource Available",
      message: `"Web Development with React - Tutorial" has been uploaded by Prof. Rajan Perera.`,
      type: "new_resource",
      readStatus: false,
      relatedId: resources[3]._id,
      relatedModel: "Resource",
    },
    {
      userId: student3._id,
      title: "System Maintenance",
      message: "The library system will undergo scheduled maintenance on Saturday from 2–4 AM.",
      type: "system",
      readStatus: true,
    },
  ]);
  console.log("🔔  Notifications seeded");

  // ── Summary ───────────────────────────────────────────────────────────────────
  console.log("\n✅  Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("👥  Users        : 1 admin, 2 lecturers, 3 students");
  console.log("📚  Books        : 8 books");
  console.log("📄  Resources    : 7 resources");
  console.log("📅  Reservations : 5 (active/pending/overdue/returned)");
  console.log("🔔  Notifications: 6");
  console.log("─────────────────────────────────────────");
  console.log("\n🔑  Login credentials (all passwords: password123)");
  console.log("   admin@university.edu          → Admin");
  console.log("   amara.silva@university.edu    → Lecturer");
  console.log("   rajan.perera@university.edu   → Lecturer");
  console.log("   kavya@student.university.edu  → Student");
  console.log("   nadun@student.university.edu  → Student");
  console.log("   sandali@student.university.edu→ Student");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
