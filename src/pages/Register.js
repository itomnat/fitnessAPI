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
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h1 className="text-center mb-4">Register</h1>
                    <Form onSubmit={handleSubmit}>
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
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Register
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <Link to="/login">Login here</Link>
                            </p>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
