import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

const Homepage = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/',{
        refresh: refreshToken,
      });
      localStorage.setItem('access_token', response.data.access);
      return response.data.access;
    }catch(error){
      console.error('Failed to refresh token', error);
      navigate('/login');
    }
  };

  const fetchData = useCallback(async () => {
    let accessToken = localStorage.getItem('access_token');
    try {

      const transactionResponse = await axios.get('http://localhost:8000/api/transactions/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTransactions(transactionResponse.data);

      const goalsResponse = await axios.get('http://localhost:8000/api/goals/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setGoals(goalsResponse.data);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        
        accessToken =await refreshAccessToken();
        if (accessToken){
          const transactionResponse = await axios.get('http://localhost:8000/api/transactions/',{
            headers:{
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setTransactions(transactionResponse.data);

          const goalsResponse = await axios.get('http://localhost:8000/api/goals/',{
            headers:{
              Authorization: `Bearer ${accessToken}`,
            },
          });
        setGoals(goalsResponse.data);
      }else{
        navigate('/login');
      }
    } else {
        setError('Failed to fetch data. Please try again.');
      }
    }
  }, [navigate], refreshAccessToken);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
     
      <h3>Transactions</h3>
      <Link to="/transactions">Add Transaction</Link>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.description} - ${transaction.amount}
            </li>
          ))
        ) : (
          <p>No Transactions found.</p>
        )}
      </ul>

      <h3>Your Goals</h3>
      <Link to="/Goals">Add Goals</Link>
      <ul>
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li key={goal.id}>
              {goal.description} - Target: {goal.target_amount} - Current: {goal.current_amount}
            </li>
          ))
        ) : (
          <p>No goals found.</p>
        )}
      </ul>
    </div>
  );
};

export default Homepage;
