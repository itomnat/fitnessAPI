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
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Fitness Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user.id ? (
                            <>
                                <Nav.Link as={Link} to="/workouts">
                                    My Workouts
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register">
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user.id ? (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
