const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createTicket,
  getAllTickets,
  getTicketsByStudent,
  assignTicket,
  updateTicketStatus,
  deleteTicket,
} = require("../controllers/ticketController");

router.post("/", upload.single("attachment"), createTicket);
router.get("/", getAllTickets);
router.get("/student/:email", getTicketsByStudent);
router.put("/assign/:id", assignTicket);
router.put("/status/:id", updateTicketStatus);
router.delete("/:id", deleteTicket);

module.exports = router;