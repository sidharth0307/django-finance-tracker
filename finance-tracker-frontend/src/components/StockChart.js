import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ stockHistory }) => {

  if (!stockHistory || stockHistory.length === 0) {
    return <div>No stock data available</div>;
  }

	const data ={
		labels: stockHistory.map((item) => item.date),
		datasets: [
		{
			label: 'Open Price',
			data: stockHistory.map((item) => item.open),
			borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
			fill: false,
			tension: 0.1,
		},
    {
      label: 'Close Price',
      data: stockHistory.map((item) => item.close),
      borderColor: 'rgba(255,99,132,1)',
      fill: false,
      tension: 0.1,
    },
	],
};

 const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: 'category', 
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

return <Line data={data} options={options} />;
};

export default StockChart;
