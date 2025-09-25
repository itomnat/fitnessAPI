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

            <Row className="justify-content-center mb-5">
                <Col lg={8}>
                    <Card className="text-center shadow-custom">
                        <Card.Body className="p-5">
                            <div className="mb-4">
                                <i className="fas fa-dumbbell text-gradient" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h2 className="mb-4 text-gradient">Ready to Start Your Fitness Journey?</h2>
                            <p className="lead mb-4 text-muted">
                                Join thousands of users who are already tracking their workouts and achieving their fitness goals.
                            </p>
                            
                            {user.id ? (
                                <div className="d-grid gap-3">
                                    <Link to="/workouts" className="btn btn-primary btn-lg">
                                        <i className="fas fa-chart-line me-2"></i>
                                        View My Workouts
                                    </Link>
                                    <p className="text-muted mb-0">
                                        Welcome back! Continue tracking your fitness progress.
                                    </p>
                                </div>
                            ) : (
                                <div className="d-grid gap-4">
                                    <div className="row g-3 justify-content-center">
                                        <div className="col-md-5 col-lg-4">
                                            <Link to="/login" className="btn btn-primary btn-lg w-100">
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Login
                                            </Link>
                                        </div>
                                        <div className="col-md-5 col-lg-4">
                                            <Link to="/register" className="btn btn-outline-primary btn-lg w-100">
                                                <i className="fas fa-user-plus me-2"></i>
                                                Register
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-0 text-center">
                                        New to Fitness Tracker? Create an account to get started!
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Features Section */}
            <Row className="justify-content-center">
                <Col lg={10}>
                    <h3 className="text-center mb-5 text-gradient">Why Choose Fitness Tracker?</h3>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="text-center h-100 shadow-custom">
                                <Card.Body className="p-4">
                                    <div className="mb-3">
                                        <i className="fas fa-chart-bar text-gradient" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h5 className="mb-3">Track Progress</h5>
                                    <p className="text-muted">
                                        Monitor your workout history and see your fitness journey unfold over time.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center h-100 shadow-custom">
                                <Card.Body className="p-4">
                                    <div className="mb-3">
                                        <i className="fas fa-mobile-alt text-gradient" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h5 className="mb-3">Mobile Friendly</h5>
                                    <p className="text-muted">
                                        Access your workouts anywhere, anytime with our responsive design.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center h-100 shadow-custom">
                                <Card.Body className="p-4">
                                    <div className="mb-3">
                                        <i className="fas fa-trophy text-gradient" style={{ fontSize: '2.5rem' }}></i>
                                    </div>
                                    <h5 className="mb-3">Achieve Goals</h5>
                                    <p className="text-muted">
                                        Set and track your fitness goals with our comprehensive workout management system.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </Container>
        </main>
    );
}
