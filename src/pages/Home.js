import { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <main>
            <Container className="fade-in-up">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <div className="page-header text-center">
                        <h1 className="page-title">Welcome to Fitness Tracker</h1>
                        <p className="page-subtitle">
                            Track your workouts, monitor your progress, and achieve your fitness goals with our intuitive platform!
                        </p>
                    </div>
                </Col>
            </Row>

            {/* Hero Section */}
            <Row className="justify-content-center mb-5">
                <Col lg={10} className="text-center">
                    <div className="mb-4">
                        <i className="fas fa-dumbbell text-gradient" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <h1 className="mb-4 text-gradient display-4 fw-bold">Ready to Start Your Fitness Journey?</h1>
                    <p className="lead mb-5 text-muted fs-4">
                        Join thousands of users who are already tracking their workouts and achieving their fitness goals.
                    </p>
                    
                    {user.id ? (
                        <div className="text-center">
                            <Link to="/workouts" className="btn btn-primary btn-lg px-5 py-3 mb-3">
                                <i className="fas fa-chart-line me-2"></i>
                                View My Workouts
                            </Link>
                            <p className="text-muted mb-0 fs-5">
                                Welcome back! Continue tracking your fitness progress.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="mb-4">
                                <div className="row justify-content-center g-4">
                                    <div className="col-auto">
                                        <Link to="/login" className="btn btn-primary btn-lg px-5 py-3">
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Login
                                        </Link>
                                    </div>
                                    <div className="col-auto">
                                        <Link to="/register" className="btn btn-outline-primary btn-lg px-5 py-3">
                                            <i className="fas fa-user-plus me-2"></i>
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted mb-0 fs-5">
                                New to Fitness Tracker? Create an account to get started!
                            </p>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Features Section */}
            <Row className="justify-content-center mb-5">
                <Col lg={12}>
                    <h2 className="text-center mb-5 text-gradient display-5 fw-bold">Why Choose Fitness Tracker?</h2>
                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <Card className="text-center h-100 shadow-custom border-0">
                                <Card.Body className="p-4">
                                    <div className="mb-4">
                                        <i className="fas fa-chart-bar text-gradient" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h4 className="mb-3 fw-bold">Track Progress</h4>
                                    <p className="text-muted fs-6">
                                        Monitor your workout history and see your fitness journey unfold over time.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6}>
                            <Card className="text-center h-100 shadow-custom border-0">
                                <Card.Body className="p-4">
                                    <div className="mb-4">
                                        <i className="fas fa-mobile-alt text-gradient" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h4 className="mb-3 fw-bold">Mobile Friendly</h4>
                                    <p className="text-muted fs-6">
                                        Access your workouts anywhere, anytime with our responsive design.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={12}>
                            <Card className="text-center h-100 shadow-custom border-0">
                                <Card.Body className="p-4">
                                    <div className="mb-4">
                                        <i className="fas fa-trophy text-gradient" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                    <h4 className="mb-3 fw-bold">Achieve Goals</h4>
                                    <p className="text-muted fs-6">
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
            <footer className="mt-5 py-4 bg-light border-top">
                <Container>
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <p className="text-muted mb-0 fs-6">
                                © 2025 Nataniel Itom. All rights reserved.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </main>
    );
}
