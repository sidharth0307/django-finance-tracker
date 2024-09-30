import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar =() => {
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
    window.location.reload();
  };

	return(
		<Navbar bg="light" expands="lg">
			
			<Container>
				<Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/stock-information">Stock Information</Nav.Link>
						<Nav.Link as={Link} to="/transactions">Add Transaction</Nav.Link>
						<Nav.Link as={Link} to="/goals">Add Goals</Nav.Link>
					</Nav>
					{ location.pathname !== '/login' && (
						<button variant="outline-danger" onClick={handleLogout}>Logout</button>
					)}
				</Navbar.Collapse>
			</Container>
			
		</Navbar>
	);
};

export default NavigationBar;