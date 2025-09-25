import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import API_BASE_URL from '../config/api';

export default function Workouts() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        duration: ''
    });

    // Redirect if user is not logged in
    useEffect(() => {
        if (!user || user.id === null) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetch workouts on component mount
    useEffect(() => {
        if (user && user.id) {
            fetchWorkouts();
        }
    }, [user]);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/workouts/getMyWorkouts`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWorkouts(data.workouts || []);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                notyf.error('Failed to fetch workouts');
            }
        } catch (error) {
            console.error('Error fetching workouts:', error);
            notyf.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorkout = () => {
        setEditingWorkout(null);
        setFormData({ name: '', duration: '' });
        setShowModal(true);
    };

    const handleEditWorkout = (workout) => {
        setEditingWorkout(workout);
        setFormData({
            name: workout.name,
            duration: workout.duration
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingWorkout 
                ? `${API_BASE_URL}/workouts/updateWorkout/${editingWorkout._id}`
                : `${API_BASE_URL}/workouts/addWorkout`;

            const method = editingWorkout ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                notyf.success(editingWorkout ? 'Workout updated successfully!' : 'Workout added successfully!');
                setShowModal(false);
                fetchWorkouts();
            } else {
                const data = await response.json();
                notyf.error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving workout:', error);
            notyf.error('Network error. Please try again.');
        }
    };

    const handleDeleteWorkout = async (workoutId) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/workouts/deleteWorkout/${workoutId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    notyf.success('Workout deleted successfully!');
                    fetchWorkouts();
                } else {
                    notyf.error('Failed to delete workout');
                }
            } catch (error) {
                console.error('Error deleting workout:', error);
                notyf.error('Network error. Please try again.');
            }
        }
    };

    const handleCompleteWorkout = async (workoutId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/workouts/completeWorkoutStatus/${workoutId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                notyf.success('Workout marked as completed!');
                fetchWorkouts();
            } else {
                notyf.error('Failed to update workout status');
            }
        } catch (error) {
            console.error('Error updating workout status:', error);
            notyf.error('Network error. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Workouts</h1>
                <Button 
                    variant="primary" 
                    onClick={handleAddWorkout}
                    id="addWorkout"
                >
                    Add Workout
                </Button>
            </div>

            {workouts.length === 0 ? (
                <Alert variant="info">
                    No workouts found. Click "Add Workout" to get started!
                </Alert>
            ) : (
                <Row>
                    {workouts.map((workout) => (
                        <Col key={workout._id} md={6} lg={4} className="mb-3">
                            <Card className="workout-card">
                                <Card.Body>
                                    <Card.Title>{workout.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Duration:</strong> {workout.duration}<br />
                                        <strong>Date Added:</strong> {formatDate(workout.dateAdded)}<br />
                                        <strong>Status:</strong>{' '}
                                        <span className={`badge ${workout.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                            {workout.status}
                                        </span>
                                    </Card.Text>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => handleEditWorkout(workout)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDeleteWorkout(workout._id)}
                                        >
                                            Delete
                                        </Button>
                                        {workout.status !== 'completed' && (
                                            <Button 
                                                variant="outline-success" 
                                                size="sm"
                                                onClick={() => handleCompleteWorkout(workout._id)}
                                            >
                                                Complete
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Add/Edit Workout Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Workout Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter workout name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., 30 mins, 1 hour"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingWorkout ? 'Update Workout' : 'Add Workout'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}
