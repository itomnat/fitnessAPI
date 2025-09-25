import { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
    const { user, unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        unsetUser();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <i className="fas fa-dumbbell me-2"></i>
                    Fitness Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
                    <i className="fas fa-bars"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user.id && (
                            <Nav.Link as={Link} to="/workouts" className="nav-link-custom">
                                <i className="fas fa-chart-line me-1"></i>
                                My Workouts
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {user.id ? (
                            <Button 
                                variant="outline-primary" 
                                onClick={handleLogout}
                                className="btn-logout"
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Logout
                            </Button>
                        ) : (
                            <div className="auth-buttons">
                                <Button 
                                    variant="primary" 
                                    as={Link} 
                                    to="/login"
                                    className="btn-login"
                                >
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Login
                                </Button>
                                <Button 
                                    variant="outline-primary" 
                                    as={Link} 
                                    to="/register"
                                    className="btn-register"
                                >
                                    <i className="fas fa-user-plus me-2"></i>
                                    Register
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
