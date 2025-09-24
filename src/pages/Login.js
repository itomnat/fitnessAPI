import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext.js';
import API_BASE_URL from '../config/api.js';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    function authenticate(e) {
        e.preventDefault();
        
        fetch(`${API_BASE_URL}/auth?action=login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            
            if(data.access !== undefined){
                console.log(data.access);
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail("");
                setPassword("");
                notyf.success('Successful Login');
            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try again.');			
            } else {
                notyf.error('User not found. Try again.');
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            notyf.error('Login failed. Please try again.');
        });
    }

    const retrieveUserDetails = (token) => {
        fetch(`${API_BASE_URL}/auth?action=verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        })
        .catch(err => {
            console.error('Error fetching user details:', err);
        });
    };

    useEffect(() => {
        // Validation to enable submit button when all fields are populated
        if(email !== '' && password !== ''){
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    // Redirect to workouts if user is already logged in
    if (user.id !== null) {
        return <Navigate to="/workouts" />;
    }

    return (
        <Container className="fade-in">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow-custom">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h1 className="text-gradient mb-3">Welcome Back!</h1>
                                <p className="text-muted">Sign in to continue your fitness journey</p>
                            </div>
                            
                            <Form onSubmit={(e) => authenticate(e)}>
                                <Form.Group controlId="userEmail" className="mb-4">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="form-control-lg"
                                    />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="form-control-lg"
                                    />
                                </Form.Group>

                                {isActive ? 
                                    <Button variant="primary" type="submit" className="w-100 btn-lg mb-3">
                                        Sign In
                                    </Button>
                                    : 
                                    <Button variant="secondary" type="submit" className="w-100 btn-lg mb-3" disabled>
                                        Sign In
                                    </Button>
                                }
                                
                                <div className="text-center">
                                    <p className="mb-0">Don't have an account? 
                                        <Button variant="link" as={Link} to="/register" className="p-0 ms-1">
                                            Create one here
                                        </Button>
                                    </p>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
