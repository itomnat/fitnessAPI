import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import API_BASE_URL from '../config/api';

export default function Login() {
	const notyf = new Notyf();
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user.id !== null) {
            navigate('/workouts');
        }
    }, [user.id, navigate]);


    const authenticate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.access !== undefined) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                setEmail("");
                setPassword("");

                notyf.success('Successful Login');
                navigate('/workouts');
            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try again.');
            } else {
                notyf.error('User not found. Try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            notyf.error('Network error. Please try again.');
        }
    };


    const retrieveUserDetails = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin
                });
            }
        } catch (error) {
            console.error('Error retrieving user details:', error);
        }
    };

    useEffect(() => {
        // Validation to enable submit button when all fields are populated
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h1 className="text-center mb-4">Login</h1>
                    <Form onSubmit={authenticate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={!isActive}
                                className="mb-3"
                            >
                                Login
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <Link to="/register">Register here</Link>
                            </p>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}