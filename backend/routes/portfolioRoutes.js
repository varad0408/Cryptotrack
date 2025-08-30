const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Import the middleware

const {
  addHolding,
  getHoldings,
  deleteHolding,
  getSummary
} = require("../controllers/portfolioController");

// This line applies the auth middleware to ALL routes in this file
router.use(auth);

// These routes are now protected
router.post("/", addHolding);
router.get("/", getHoldings);
router.get("/summary", getSummary);
router.delete("/:id", deleteHolding);

module.exports = router;