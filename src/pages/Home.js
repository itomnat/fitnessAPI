import { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    // Redirect to workouts if user is already logged in
    if (user.id !== null) {
        return <Navigate to="/workouts" />;
    }

    return (
        <Container className="fade-in">
            <div className="hero-section">
                <h1 className="display-4">💪 Fitness Tracker</h1>
                <p className="lead">
                    Track your workouts, monitor your progress, and achieve your fitness goals!
                </p>
            </div>
            
            <Row className="justify-content-center mb-5">
                <Col md={6} className="mb-4">
                    <Card className="feature-card slide-up">
                        <Card.Body>
                            <div className="feature-icon">🚀</div>
                            <Card.Title className="feature-title">Get Started</Card.Title>
                            <Card.Text className="feature-description">
                                Create an account to start tracking your workouts and building healthy habits.
                            </Card.Text>
                            <Button as={Link} to="/register" variant="primary" size="lg" className="w-100">
                                Register Now
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6} className="mb-4">
                    <Card className="feature-card slide-up">
                        <Card.Body>
                            <div className="feature-icon">📊</div>
                            <Card.Title className="feature-title">Track Progress</Card.Title>
                            <Card.Text className="feature-description">
                                Already have an account? Sign in to continue your fitness journey.
                            </Card.Text>
                            <Button as={Link} to="/login" variant="outline-primary" size="lg" className="w-100">
                                Sign In
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <div className="mt-5">
                <h2 className="text-center text-gradient mb-5">Why Choose Our Platform?</h2>
                <Row className="mt-4">
                    <Col md={4} className="mb-4">
                        <Card className="feature-card h-100">
                            <Card.Body className="text-center">
                                <div className="feature-icon">📝</div>
                                <Card.Title className="feature-title">Log Workouts</Card.Title>
                                <Card.Text className="feature-description">
                                    Add and track your daily workouts with ease. Never miss a session again.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="feature-card h-100">
                            <Card.Body className="text-center">
                                <div className="feature-icon">📈</div>
                                <Card.Title className="feature-title">Monitor Progress</Card.Title>
                                <Card.Text className="feature-description">
                                    Keep track of your fitness journey over time with detailed analytics.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="feature-card h-100">
                            <Card.Body className="text-center">
                                <div className="feature-icon">🎯</div>
                                <Card.Title className="feature-title">Achieve Goals</Card.Title>
                                <Card.Text className="feature-description">
                                    Stay motivated and reach your fitness targets with our goal tracking system.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}
