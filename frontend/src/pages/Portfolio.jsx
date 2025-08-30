import React, { useEffect, useMemo, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [form, setForm] = useState({ coinId: "", coinName: "", symbol: "", amount: "", buyPrice: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` }),
    [token]
  );

  const fetchHoldings = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/portfolio/holdings`, { headers });
    const data = await res.json();
    setHoldings(res.ok ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchHoldings(); /* eslint-disable-next-line */ }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.coinId || !form.amount || !form.buyPrice) return alert("Fill coin, amount and buy price");
    const res = await fetch(`${API}/api/portfolio/holdings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        coinId: form.coinId,
        coinName: form.coinName,
        symbol: form.symbol,
        amount: Number(form.amount),
        buyPrice: Number(form.buyPrice),
      }),
    });
    if (res.ok) {
      setForm({ coinId: "", coinName: "", symbol: "", amount: "", buyPrice: "" });
      fetchHoldings();
    } else {
      const d = await res.json();
      alert(d.message || "Failed to add holding");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this holding?")) return;
    const res = await fetch(`${API}/api/portfolio/holdings/${id}`, { method: "DELETE", headers });
    if (res.ok) fetchHoldings();
  };

  // Load live prices for table & summary
  const [prices, setPrices] = useState({});
  const loadPrices = async () => {
    if (holdings.length === 0) return;
    const uniqueIds = [...new Set(holdings.map(h => h.coinId))].join(",");
    const res = await fetch(`${API}/api/crypto/prices?ids=${uniqueIds}`);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      const map = {};
      data.forEach(c => { map[c.id] = c.current_price; });
      setPrices(map);
    }
  };

  useEffect(() => { loadPrices(); /* eslint-disable-next-line */ }, [holdings]);

  const totals = useMemo(() => {
    let invested = 0, current = 0;
    holdings.forEach(h => {
      invested += h.amount * h.buyPrice;
      const live = prices[h.coinId] || 0;
      current += h.amount * live;
    });
    const pnl = current - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
    return { invested, current, pnl, pnlPct };
  }, [holdings, prices]);

  return (
    <div className="container">
      <h1 className="page-title">Portfolio</h1>

      {/* Summary */}
      <div className="cards">
        <div className="card">
          <div className="card-title">Total Invested</div>
          <div className="card-value">${totals.invested.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="card-title">Current Value</div>
          <div className="card-value">${totals.current.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="card-title">P/L</div>
          <div className={`card-value ${totals.pnl >= 0 ? "green" : "red"}`}>
            ${totals.pnl.toFixed(2)} ({totals.pnlPct.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Add holding */}
      <form className="form" onSubmit={handleAdd}>
        <div className="form-row">
          <input
            placeholder="Coin ID (e.g., bitcoin)"
            value={form.coinId}
            onChange={(e) => setForm({ ...form, coinId: e.target.value })}
          />
          <input
            placeholder="Coin Name (Bitcoin)"
            value={form.coinName}
            onChange={(e) => setForm({ ...form, coinName: e.target.value })}
          />
          <input
            placeholder="Symbol (BTC)"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            step="any"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            type="number"
            step="any"
            placeholder="Buy Price (USD)"
            value={form.buyPrice}
            onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
          />
          <button type="submit">Add</button>
        </div>
      </form>

      {/* Holdings table */}
      <div className="table-wrap">
        <div className="table-title">
          Your Holdings {loading && <span className="muted"> (loading…)</span>}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Amount</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Value</th>
              <th>P/L</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const live = prices[h.coinId] || 0;
              const value = live * h.amount;
              const cost = h.buyPrice * h.amount;
              const diff = value - cost;
              const diffPct = cost > 0 ? (diff / cost) * 100 : 0;
              return (
                <tr key={h._id}>
                  <td>{h.coinName || h.coinId} <span className="muted">({h.symbol})</span></td>
                  <td>{h.amount}</td>
                  <td>${h.buyPrice.toFixed(2)}</td>
                  <td>${live.toFixed(2)}</td>
                  <td>${value.toFixed(2)}</td>
                  <td className={diff >= 0 ? "green" : "red"}>
                    ${diff.toFixed(2)} ({diffPct.toFixed(2)}%)
                  </td>
                  <td><button className="link danger" onClick={() => handleDelete(h._id)}>Remove</button></td>
                </tr>
              );
            })}
            {holdings.length === 0 && (
              <tr><td colSpan="7" className="muted">No holdings yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
