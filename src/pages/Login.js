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
            console.log('Attempting login with:', { email, password: '***' });
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

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok && data.access !== undefined) {
                localStorage.setItem('token', data.access);
                await retrieveUserDetails(data.access);

                setEmail("");
                setPassword("");

                notyf.success('Successful Login');
                navigate('/workouts');
            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try again.');
            } else {
                notyf.error(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            notyf.error('Network error. Please try again.');
        }
    };


    const retrieveUserDetails = async (token) => {
        try {
            console.log('Retrieving user details with token:', token.substring(0, 20) + '...');
            const response = await fetch(`${API_BASE_URL}/users/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('User details response status:', response.status);
            const data = await response.json();
            console.log('User details response data:', data);

            if (response.ok) {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
                console.log('User context updated successfully');
            } else {
                console.error('Failed to retrieve user details:', data);
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
        <div className="auth-container">
            <div className="auth-card fade-in-up">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue your fitness journey</p>
                </div>
                
                <div className="auth-body">
                    <Form onSubmit={authenticate}>
                        <Form.Group className="mb-4">
                            <Form.Label>
                                <i className="fas fa-envelope me-2"></i>
                                Email Address
                            </Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <i className="fas fa-lock me-2"></i>
                                Password
                            </Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>

                        <div className="d-grid mb-4">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={!isActive}
                                size="lg"
                                className="btn-lg"
                            >
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Sign In
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="auth-link">
                    <p className="mb-0">
                        Don't have an account?{' '}
                        <Link to="/register">Create one here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}