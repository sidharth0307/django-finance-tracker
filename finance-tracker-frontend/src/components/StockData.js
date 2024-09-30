import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockData = ({ stock = [] }) => {
    const [symbol, setSymbol] = useState('AAPL');
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:8000/api/stock/${symbol}/`);
            setStockData(response.data);
        } catch (error) {
            setError('Failed to fetch stock data');
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchStockData();  // Fetch data when symbol changes
    }, [symbol]);

    return (
        <div>
            {stock && stock.length > 0 ? (
                stock.map((item) => (
                    <div key={item.id} className={`stock-item ${item.change > 0 ? 'positive' : 'negative'}`}>
                        <span>{item.name}: ${item.price}</span>
                        <span className="indicator">{item.change > 0 ? '▲' : '▼'}</span>
                    </div>
                ))
            ) : (
                <p>No stock data available</p>
            )}

            {stockData?.history && stockData.history.length > 0 ? (
            <ul>
                {stockData.history.map((entry) => (
                <li key={entry.date}>
                    <strong>{entry.date}</strong>: Open {entry.open}, Close {entry.close}
                </li>
                ))}
            </ul>
            ) :(
                <p>No historical data available</p>
            )}

            <h2>Stock Data for {symbol}</h2>

            <div>
                <label htmlFor="symbol">Enter Stock Symbol:</label>
                <input
                    id="symbol"
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
                <button onClick={fetchStockData}>Fetch Stock Data</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {stockData && (
                <div>
                    <h3>Stock Information</h3>
                    <p><strong>Name:</strong> {stockData.stock_info.longName}</p>
                    <p><strong>Symbol:</strong> {stockData.stock_info.symbol}</p>
                    <p><strong>Market Price:</strong> {stockData.stock_info.marketPrice}</p>
                    <p><strong>Market Change:</strong> {stockData.stock_info.marketChange}</p>
                    <p><strong>Previous Close:</strong> {stockData.stock_info.previousClose}</p>

                    <h4>Recent Prices:</h4>
                    <ul>
                        {stockData.history.map((entry) => (
                            <li key={entry.date}>
                                <strong>{entry.date}</strong>: Open {entry.open}, Close {entry.close}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StockData;
