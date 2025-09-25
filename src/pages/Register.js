import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import API_BASE_URL from '../config/api';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        if (user.id !== null) {
            navigate('/workouts');
        }
    }, [user.id, navigate]);

    // Form validation
    useEffect(() => {
        const isValid = email !== '' && 
                       password !== '' && 
                       confirmPassword !== '' && 
                       password === confirmPassword &&
                       password.length >= 6;
        setIsActive(isValid);
    }, [email, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            notyf.error('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
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

            if (response.ok) {
                notyf.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                notyf.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            notyf.error('Network error. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card fade-in-up">
                <div className="auth-header">
                    <h1 className="auth-title">Join Fitness Tracker</h1>
                    <p className="auth-subtitle">Start your fitness journey today</p>
                </div>
                
                <div className="auth-body">
                    <Form onSubmit={handleSubmit}>
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
                                placeholder="Create a password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="form-control-lg"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <i className="fas fa-lock me-2"></i>
                                Confirm Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <i className="fas fa-user-plus me-2"></i>
                                Create Account
                            </Button>
                        </div>
                    </Form>
                </div>

                <div className="auth-link">
                    <p className="mb-0">
                        Already have an account?{' '}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
