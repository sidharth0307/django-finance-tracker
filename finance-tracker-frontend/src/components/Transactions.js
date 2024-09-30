import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
	const [description, setdescription] = useState('');
	const [amount, setAmount] = useState('');
	const [category, setCategory] = useState('');
	const [type, setType] = useState('');
	const [date, setDate] = useState('');
	const [error,setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const accessToken =localStorage.getItem('access_token');

		try{
			const response = await axios.post('http://localhost:8000/api/transactions/',
				{description, amount, category, date, type },
				{headers: {Authorization: `Bearer ${accessToken}` }}
			);
			if (response.status === 201){
				navigate('/');
			}
			}catch(error) {
				if (error.response){
				console.error("Error response data:",error.response.data);
				if (typeof error.response.data === 'object'){
					const errorMessage = JSON.stringify(error.response.data);
					setError(errorMessage);
				}else{
					setError(error.response.data);
				}
			}else{
				console.error("Error message:", error.message);
				setError('Failed to add transaction. Please try again.');
			}
		}
	};

	return(
			<div>
				<h2> Add Transactions</h2>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<form onSubmit={handleSubmit}>
					<div>
						<label>Description:</label>
						<input
							type="text"
							value={description}
							onChange={(e) => setdescription(e.target.value)}
						/>
					</div>
					<div>
						<label>Amount:</label>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
					</div>
					<div>
						<label>Category:</label>
							<select value={category} onChange={(e) => setCategory(e.target.value)}>
								<option value="food">Food</option>
								<option value="transport">Transport</option>
								<option value="clothes">Clothes</option>
								<option value="medical">Medical Expense</option>
								<option value="insurance">Insurance</option>
								<option value="EMI">EMI</option>
							</select>
						
							
					</div>
					<div>
						<label>Date:</label>
							<input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
					</div>
					<div>
						<label>Type:</label>
							<select value={type} onChange={(e) => setType(e.target.value)}>
								<option value="debit">Debit</option>
								<option value="credit">Credit</option>
							</select>
					</div>
					<button type="submit">Add Transaction</button>
				</form>
			</div>
		);

			
	
};
export default Transactions;