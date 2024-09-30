import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Transactions from './components/Transactions';
import Goals from './components/Goals';
import Register from'./pages/Register';
import NotFound from'./pages/NotFound';
import StockInformation from './pages/StockInformation';
import NavigationBar from './components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){

  return(
  <div>
    <Router>
      {window.location.pathname !== '/login' && <NavigationBar />}
      <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/stock-information" element={<StockInformation />} />
        <Route path="/stock/:symbol" element={StockInformation} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;