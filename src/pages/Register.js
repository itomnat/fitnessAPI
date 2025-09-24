import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext.js';
import API_BASE_URL from '../config/api.js';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    function registerUser(e) {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            notyf.error('Passwords do not match');
            return;
        }
        
        fetch(`${API_BASE_URL}/auth/register`, {
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
                setConfirmPassword("");
                notyf.success('Registration Successful');
            } else if (data.message === "User already exists") {
                notyf.error('User already exists. Please login instead.');
            } else {
                notyf.error('Registration failed. Please try again.');
            }
        })
        .catch(err => {
            console.error('Registration error:', err);
            notyf.error('Registration failed. Please try again.');
        });
    }

    const retrieveUserDetails = (token) => {
        fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            // Note: setUser is not available in this component
            // The user will be redirected to workouts after successful registration
        })
        .catch(err => {
            console.error('Error fetching user details:', err);
        });
    };

    useEffect(() => {
        // Validation to enable submit button when all fields are populated
        if(email !== '' && password !== '' && confirmPassword !== ''){
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password, confirmPassword]);

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
                                <h1 className="text-gradient mb-3">Join Us Today!</h1>
                                <p className="text-muted">Create your account and start your fitness journey</p>
                            </div>
                            
                            <Form onSubmit={(e) => registerUser(e)}>
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

                                <Form.Group controlId="confirmPassword" className="mb-4">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="form-control-lg"
                                    />
                                </Form.Group>

                                {isActive ? 
                                    <Button variant="primary" type="submit" className="w-100 btn-lg mb-3">
                                        Create Account
                                    </Button>
                                    : 
                                    <Button variant="secondary" type="submit" className="w-100 btn-lg mb-3" disabled>
                                        Create Account
                                    </Button>
                                }
                                
                                <div className="text-center">
                                    <p className="mb-0">Already have an account? 
                                        <Button variant="link" as={Link} to="/login" className="p-0 ms-1">
                                            Sign in here
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
