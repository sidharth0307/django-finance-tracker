import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Loginpage=({ setToken }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		axios.post('http://localhost:8000/api/auth/token/', {
			username,
			password
		})
		.then(response => {
			localStorage.setItem('access_token', response.data.access);
			localStorage.setItem('refresh_token', response.data.refresh);
			navigate('/');
			window.location.reload();
			setError(null);
		})
		.catch(error => {
			setError('Invalid username or password');
		});
	};

	return(
		<div>
			<h2>Login</h2>
			{error && <p>Error: {error}</p>}
			<form onSubmit={handleSubmit}>
			<div>
				<label>Username:</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button type="submit">Login</button>
			</form>
			<div>
				<Link to ="/register">Register here</Link>
			</div>
		</div>
		);
};

export default Loginpage;