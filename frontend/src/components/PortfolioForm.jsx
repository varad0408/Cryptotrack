// src/components/PortfolioForm.jsx
import React, { useState } from "react";
import api from "../services/api";

const PortfolioForm = ({ onUpdate }) => {
  const [form, setForm] = useState({
    coinId: "",
    symbol: "",
    amount: "",
    buyPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Always hit /api/portfolio
      await api.post("/api/portfolio", form);
      setForm({ coinId: "", symbol: "", amount: "", buyPrice: "" });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error adding holding:", error.response?.data || error.message);
      alert("Could not add holding. Please check your inputs.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">Add Holding</div>
      <form onSubmit={handleSubmit} className="portfolio-form">
        <input
          type="text"
          name="coinId"
          placeholder="Coin ID (e.g. bitcoin)"
          value={form.coinId}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          name="symbol"
          placeholder="Symbol (e.g. BTC)"
          value={form.symbol}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="number"
          name="buyPrice"
          placeholder="Buy Price (USD)"
          value={form.buyPrice}
          onChange={handleChange}
          required
          className="form-input"
        />
        <button type="submit" className="btn" style={{ marginTop: "1rem" }}>
          Add Holding
        </button>
      </form>
    </div>
  );
};

export default PortfolioForm;
