const Portfolio = require("../models/Portfolio");
const axios = require("axios");

// Simple in-memory cache for CoinGecko prices
const priceCache = new Map();
const CACHE_DURATION = 60 * 1000; // Cache prices for 1 minute

// Add a new holding
exports.addHolding = async (req, res) => {
  try {
    const { coinId, symbol, amount, buyPrice } = req.body;
    if (!coinId || !symbol || amount == null || buyPrice == null) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const holding = new Portfolio({
      user: req.userId,
      coinId,
      symbol,
      amount: Number(amount),
      buyPrice: Number(buyPrice),
    });
    await holding.save();
    res.status(201).json(holding);
  } catch (err) {
    console.error("❌ Error adding holding:", err.message);
    res.status(500).send("Server error");
  }
};

// Get all holdings for a user
exports.getHoldings = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.userId });
    res.json(holdings);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Delete a holding
exports.deleteHolding = async (req, res) => {
  try {
    const holding = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }
    // Clear cache for this user's coinId to ensure fresh summary
    priceCache.delete(holding.coinId.toLowerCase());
    res.json({ message: "Holding removed successfully" });
  } catch (err) {
    console.error("❌ Error deleting holding:", err.message);
    res.status(500).send("Server error");
  }
};

// Get portfolio summary with live prices
exports.getSummary = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.userId });
    if (holdings.length === 0) {
      return res.json({ totalInvestment: 0, currentValue: 0, pnl: 0 });
    }
    const coinIds = [...new Set(holdings.map(h => h.coinId.toLowerCase()))].join(",");
    if (!coinIds) {
      return res.json({ totalInvestment: 0, currentValue: 0, pnl: 0 });
    }

    let prices;
    const cacheKey = coinIds;
    const cached = priceCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      prices = cached.data; // Use cached prices
    } else {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`);
      prices = data;
      priceCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    let totalInvestment = 0;
    let currentValue = 0;
    holdings.forEach(h => {
      totalInvestment += h.amount * h.buyPrice;
      const livePrice = prices[h.coinId.toLowerCase()]?.usd || h.buyPrice;
      currentValue += h.amount * livePrice;
    });
    const pnl = currentValue - totalInvestment;
    res.json({ totalInvestment, currentValue, pnl });
  } catch (err) {
    console.error("❌ Error computing summary:", err);
    res.status(500).json({ message: "Server error while computing summary" });
  }
};