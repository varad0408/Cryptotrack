const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { format } = require("fast-csv");
const Portfolio = require("../models/Portfolio");
const auth = require("../middleware/auth");

router.get("/csv", auth, async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.userId }).select("coinId symbol amount buyPrice -_id").lean();
    if (holdings.length === 0) return res.status(404).send("No holdings to export.");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="portfolio.csv"');
    
    // ADDED: Calculate investment value for each holding
    const holdingsWithValues = holdings.map(h => ({
      ...h,
      totalValue: (h.amount * h.buyPrice).toFixed(2)
    }));

    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    holdingsWithValues.forEach(doc => csvStream.write(doc)); // CHANGED: Use the new array
    csvStream.end();
  } catch (err) {
    res.status(500).send("Error generating CSV file.");
  }
});

router.get("/pdf", auth, async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.userId }).lean();
    if (holdings.length === 0) return res.status(404).send("No holdings to export.");

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="portfolio.pdf"');
    doc.pipe(res);

    doc.fontSize(18).text("CryptoTrack Portfolio Report", { align: "center" });
    doc.moveDown(2);
    holdings.forEach(h => {
      // CHANGED: Added the calculated total investment value to the text
      const investmentValue = (h.amount * h.buyPrice).toFixed(2);
      doc.fontSize(12).text(`- Coin: ${h.coinId.charAt(0).toUpperCase() + h.coinId.slice(1)} (${h.symbol.toUpperCase()}) | Amount: ${h.amount} | Buy Price: $${h.buyPrice.toFixed(2)} | Investment Value: $${investmentValue}`);
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (err) {
    res.status(500).send("Error generating PDF file.");
  }
});

module.exports = router;