const express = require("express");
const axios = require("axios");
const router = express.Router();

let cache = {
  data: null,
  timestamp: 0,
};

// ✅ Get top 10 coins with details
router.get("/prices", async (req, res) => {
  try {
    const now = Date.now();
    const cacheDuration = 60 * 1000; // 1 minute cache

    if (cache.data && now - cache.timestamp < cacheDuration) {
      return res.json(cache.data);
    }

    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: "bitcoin,ethereum,solana,dogecoin,cardano,polkadot,litecoin,tron,avalanche-2,shiba-inu",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: true, // ✅ needed for chart
        price_change_percentage: "24h",
      },
    });

    cache.data = data;
    cache.timestamp = now;
    res.json(data);
  } catch (err) {
    console.error("Error fetching prices:", err.message);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

// ✅ Get coin history for charts
router.get("/history/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      { params: { vs_currency: "usd", days: 7, interval: "hourly" } }
    );
    res.json(data);
  } catch (err) {
    console.error("Error fetching coin history:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
