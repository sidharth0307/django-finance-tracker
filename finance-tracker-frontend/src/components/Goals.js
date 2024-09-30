import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Goals = () => {
	const [description, setDescription] = useState('');
	const [targetAmount, setTargetAmount] = useState('');
	const [currentAmount, setCurrentAmount] = useState('0');
	const [error, setError] = useState();
	const [goals, setGoals] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchGoals = async () => {
			const accessToken = localStorage.getItem('access_token');
			try {
				const response = await axios.get('http://localhost:8000/api/goals/', {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				setGoals(response.data);
			} catch (error) {
				console.error("Error fetching goals:", error);
			}
		};
		fetchGoals();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const accessToken = localStorage.getItem('access_token');

		try {
			const response = await axios.post('http://localhost:8000/api/goals/', {
				description,
				target_amount: targetAmount,
				current_amount: currentAmount,
			}, {
				headers: { Authorization: `Bearer ${accessToken}` }
			});
			if (response.status === 201) {
				navigate('/');
			}
		} catch (error) {
			if (error.response) {
				console.error("Error response data:", error.response.data);
				setError("Failed to add goal. " + (error.response.data.description || "Please try again."));
			} else {
				setError('Failed to add goal. Please try again.');
			}
		}
	};

	return (
		<div>
			<h2>Add Goal</h2>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Description:</label>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div>
					<label>Target Amount:</label>
					<input
						type="number"
						value={targetAmount}
						onChange={(e) => setTargetAmount(e.target.value)}
					/>
				</div>
				<div>
					<label>Current Amount:</label>
					<input
						type="number"
						value={currentAmount}
						onChange={(e) => setCurrentAmount(e.target.value)}
					/>
				</div>
				<button type="submit">Add Goal</button>
			</form>
		</div>
	);
};

export default Goals;
