import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <Container className="fade-in">
            <Row className="justify-content-center">
                <Col md={6} className="text-center">
                    <div className="empty-state">
                        <div className="empty-state-icon">😕</div>
                        <h1 className="empty-state-title">404 - Page Not Found</h1>
                        <p className="empty-state-description">
                            Oops! The page you're looking for seems to have wandered off. 
                            Don't worry, even the best athletes sometimes take a wrong turn!
                        </p>
                        <Button as={Link} to="/" variant="primary" size="lg">
                            🏠 Take Me Home
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
