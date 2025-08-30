import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/api";
import HoldingsTable from "../components/HoldingsTable";
import PortfolioForm from "../components/PortfolioForm";
import CryptoTable from "../components/CryptoTable";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState({ totalInvestment: 0, currentValue: 0, pnl: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [coinsRes, holdingsRes, summaryRes] = await Promise.all([
        api.get("/api/crypto/prices"),
        api.get("/api/portfolio"),
        api.get("/api/portfolio/summary"),
      ]);

      const validCoins = Array.isArray(coinsRes.data) ? coinsRes.data : [];
      setCoins(validCoins);
      setHoldings(Array.isArray(holdingsRes.data) ? holdingsRes.data : []);
      setSummary(summaryRes.data || { totalInvestment: 0, currentValue: 0, pnl: 0 });

      if (validCoins.length > 0 && !selectedCoin) setSelectedCoin(validCoins[0]);
    } catch (err) {
      setError("Could not load dashboard data. Please check server.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCoin]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleExport = (format) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to export.");
    window.open(`${API_BASE}/api/export/${format}?token=${token}`, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const chartData = useMemo(() => {
    if (!selectedCoin || !selectedCoin.sparkline_in_7d?.price) return [];
    return selectedCoin.sparkline_in_7d.price.map((price, index) => ({ index, price }));
  }, [selectedCoin]);

  if (isLoading) return <div className="container"><p className="loading-text">Loading Dashboard...</p></div>;
  if (error) return <div className="container"><p className="error-message">{error}</p></div>;

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title">Dashboard</h1>
        <div className="export-buttons">
          <button className="btn ghost" onClick={() => handleExport("csv")}>Export CSV</button>
          <button className="btn" onClick={() => handleExport("pdf")}>Export PDF</button>
          <button className="btn danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Total Investment</div>
          <div className="kpi-value">
            ${summary.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Current Portfolio Value</div>
          <div className="kpi-value">
            ${summary.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-title">Profit / Loss</div>
          <div className={`kpi-value ${summary.pnl >= 0 ? "pos" : "neg"}`}>
            ${summary.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid2 mt">
        <div className="card">
          <div className="card-header">{selectedCoin ? `${selectedCoin.name} Price Chart (7d)` : "Price Chart"}</div>
          <div style={{ height: 290 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <Tooltip contentStyle={{ background: "var(--panel)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="price" stroke={selectedCoin?.price_change_percentage_24h >= 0 ? "var(--pos)" : "var(--neg)"} dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (<div className="loading-text">No chart data.</div>)}
          </div>
        </div>
        <PortfolioForm onUpdate={loadData} />
      </div>

      <div className="mt">
        <CryptoTable coins={coins} isLoading={isLoading} onCoinSelect={setSelectedCoin} />
      </div>

      <div className="mt">
        <HoldingsTable holdings={holdings} isLoading={isLoading} onDeleted={loadData} />
      </div>
    </div>
  );
};

export default Dashboard;
