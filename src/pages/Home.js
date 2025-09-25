import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <main className="home-page">
            <Container>
                {/* Hero Section */}
                <Row className="justify-content-center mb-5">
                    <Col lg={10} className="text-center">
                        <div className="hero-icon mb-4">
                            <i className="fas fa-dumbbell"></i>
                        </div>
                        <h1 className="hero-title mb-4">Ready to Start Your Fitness Journey?</h1>
                        <p className="hero-subtitle mb-5">
                            Join thousands of users who are already tracking their workouts and achieving their fitness goals.
                        </p>
                        
                        {user.id ? (
                            <div className="text-center">
                                <Link to="/workouts" className="btn btn-primary btn-lg mb-3">
                                    <i className="fas fa-chart-line me-2"></i>
                                    View My Workouts
                                </Link>
                                <p className="welcome-text">
                                    Welcome back! Continue tracking your fitness progress.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="cta-buttons mb-4">
                                    <Link to="/login" className="btn btn-primary btn-lg me-3">
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-outline-primary btn-lg">
                                        <i className="fas fa-user-plus me-2"></i>
                                        Register
                                    </Link>
                                </div>
                                <p className="cta-text">
                                    New to Fitness Tracker? Create an account to get started!
                                </p>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Features Section */}
                <Row className="justify-content-center mb-5">
                    <Col lg={12}>
                        <h2 className="features-title text-center mb-5">Why Choose Fitness Tracker?</h2>
                        <Row className="g-4">
                            <Col lg={4} md={6}>
                                <Card className="feature-card h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="feature-icon mb-4">
                                            <i className="fas fa-chart-bar"></i>
                                        </div>
                                        <h4 className="feature-title mb-3">Track Progress</h4>
                                        <p className="feature-description">
                                            Monitor your workout history and see your fitness journey unfold over time.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4} md={6}>
                                <Card className="feature-card h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="feature-icon mb-4">
                                            <i className="fas fa-mobile-alt"></i>
                                        </div>
                                        <h4 className="feature-title mb-3">Mobile Friendly</h4>
                                        <p className="feature-description">
                                            Access your workouts anywhere, anytime with our responsive design.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4} md={12}>
                                <Card className="feature-card h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="feature-icon mb-4">
                                            <i className="fas fa-trophy"></i>
                                        </div>
                                        <h4 className="feature-title mb-3">Achieve Goals</h4>
                                        <p className="feature-description">
                                            Set and track your fitness goals with our comprehensive workout management system.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            
            {/* Footer */}
            <footer className="page-footer">
                <Container>
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <p className="footer-text">
                                © 2025 Nataniel Itom. All rights reserved.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </main>
    );
}