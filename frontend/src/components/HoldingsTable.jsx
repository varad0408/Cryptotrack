import React from "react";
import api from "../services/api";

const HoldingsTable = ({ holdings, isLoading, onDeleted, onSummaryRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holding?")) {
      try {
        await api.delete(`/api/portfolio/${id}`);
        if (onDeleted) onDeleted(); // Refresh the holdings list
        if (onSummaryRefresh) onSummaryRefresh(); // Refresh the summary
      } catch (error) {
        console.error("Error deleting holding:", error);
        alert("Could not delete the holding. Please try again.");
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">Your Holdings</div>
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Amount</th>
              <th>Buy Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  Loading holdings...
                </td>
              </tr>
            ) : holdings.length > 0 ? (
              holdings.map((h) => (
                <tr key={h._id}>
                  <td>
                    <div className="coin-name">
                      <div>
                        <div className="coin-title">{h.coinId}</div>
                        <div className="coin-sub">{h.symbol?.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>{h.amount}</td>
                  <td>${Number(h.buyPrice).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn ghost small"
                      onClick={() => handleDelete(h._id)}
                      style={{ 
                        padding: "0.3rem 0.7rem", 
                        fontSize: "0.85rem",
                        color: "#ef4444",
                        borderColor: "#ef4444"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No holdings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;