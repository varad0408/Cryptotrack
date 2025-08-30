import React from "react";

const CryptoTable = ({ coins, isLoading, onCoinSelect }) => {
  return (
    <div className="card">
      <div className="card-header">Top 10 Coins by Market Cap</div>
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h %</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading coins...</td>
              </tr>
            ) : (
              coins.map((coin, index) => (
                <tr key={coin.id} onClick={() => onCoinSelect(coin)} style={{ cursor: 'pointer' }}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="coin-name">
                      <img src={coin.image} alt={coin.name} />
                      <div>
                        <div className="coin-title">{coin.name}</div>
                        <div className="coin-sub">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td className={coin.price_change_percentage_24h >= 0 ? 'pos' : 'neg'}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;