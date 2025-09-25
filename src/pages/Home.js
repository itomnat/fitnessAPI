import { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
    const { user } = useContext(UserContext);

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center">
                        <Card.Body>
                            <h1 className="display-4 mb-4">Welcome to Fitness Tracker</h1>
                            <p className="lead mb-4">
                                Track your workouts, monitor your progress, and achieve your fitness goals!
                            </p>
                            {user.id ? (
                                <Link to="/workouts" className="btn btn-primary btn-lg">
                                    View My Workouts
                                </Link>
                            ) : (
                                <div>
                                    <Link to="/login" className="btn btn-primary btn-lg me-3">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-outline-primary btn-lg">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
