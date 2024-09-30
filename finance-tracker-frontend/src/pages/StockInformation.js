import StockData from '../components/StockData';
import StockChart from '../components/StockChart';
import React, { useState, useEffect } from 'react';

const StockInformation = () => {
	const [symbol, setSymbol] = useState('');
	const [stockData, setStockData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchStockData = async () => {
		if (!symbol) {
			setError('No stock symbol provided');
			return;
		}

		setLoading(true);
		setError(null); 

		try {
			const response = await fetch(`http://localhost:8000/api/stock/${symbol}`);
			console.log('API response:', response);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			setStockData(data);
		} catch (error) {
			setError('Error fetching data');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Stock Information</h1>
			<input 
				type="text" 
				value={symbol} 
				onChange={(e) => setSymbol(e.target.value)} 
				placeholder="Enter stock symbol" 
			/>
			<button onClick={fetchStockData}>Fetch Stock Data</button>

			{loading && <div>Loading...</div>}
			{error && <div>{error}</div>}
			{stockData && (
				<div>
					<h2>{stockData.stock_info.longName} ({stockData.stock_info.symbol})</h2>
					<p>Market Price: {stockData.stock_info.marketPrice}</p>
					<p>Previous Close: {stockData.stock_info.previousClose}</p>
					<p>Market Change: {stockData.stock_info.marketChange}</p>
					<StockChart stockHistory={stockData.history} />
				</div>
			)}
		</div>
	);
};

export default StockInformation;
