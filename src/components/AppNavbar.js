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
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <i className="fas fa-dumbbell me-2"></i>
                    Fitness Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
                    <i className="fas fa-bars"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user.id ? (
                            <>
                                <Nav.Link as={Link} to="/workouts" className="nav-link-custom">
                                    <i className="fas fa-chart-line me-1"></i>
                                    My Workouts
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                                    <i className="fas fa-sign-in-alt me-1"></i>
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                                    <i className="fas fa-user-plus me-1"></i>
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user.id ? (
                            <Button 
                                variant="outline-primary" 
                                onClick={handleLogout}
                                className="btn-logout"
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Logout
                            </Button>
                        ) : null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
