const express = require("express");
const router = express.Router();

const {
  addComment,
  getCommentsByTicket,
} = require("../controllers/commentController");

router.post("/", addComment);
router.get("/:ticketId", getCommentsByTicket);

module.exports = router;