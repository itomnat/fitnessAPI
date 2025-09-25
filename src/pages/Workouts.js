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
            <main>
                <Container>
                    <div className="loading-container">
                        <Spinner animation="border" role="status" className="spinner-border-primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="loading-text">Loading your workouts...</p>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main>
            <Container className="fade-in-up">
            <div className="page-header">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h1 className="page-title mb-2">My Workouts</h1>
                        <p className="page-subtitle mb-0">
                            Track and manage your fitness journey
                        </p>
                    </div>
                    <Button 
                        variant="primary" 
                        onClick={handleAddWorkout}
                        id="addWorkout"
                        size="lg"
                        className="mt-3 mt-md-0"
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add Workout
                    </Button>
                </div>
            </div>

            {workouts.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-dumbbell text-gradient" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                    </div>
                    <h3 className="text-gradient mb-3">No Workouts Yet</h3>
                    <p className="text-muted mb-4">
                        Start your fitness journey by adding your first workout!
                    </p>
                    <Button 
                        variant="primary" 
                        onClick={handleAddWorkout}
                        size="lg"
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add Your First Workout
                    </Button>
                </div>
            ) : (
                <Row className="g-4">
                    {workouts.map((workout, index) => (
                        <Col key={workout._id} md={6} lg={4}>
                            <Card 
                                className="workout-card h-100 shadow-custom fade-in-up" 
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Card.Body className="d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title className="mb-0">{workout.name}</Card.Title>
                                            <span className={`badge ${workout.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                <i className={`fas ${workout.status === 'completed' ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                                                {workout.status}
                                            </span>
                                        </div>
                                        <Card.Text className="mb-3">
                                            <div className="mb-2">
                                                <i className="fas fa-clock text-gradient me-2"></i>
                                                <strong>Duration:</strong> {workout.duration}
                                            </div>
                                            <div>
                                                <i className="fas fa-calendar text-gradient me-2"></i>
                                                <strong>Added:</strong> {formatDate(workout.dateAdded)}
                                            </div>
                                        </Card.Text>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="d-grid gap-2">
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleEditWorkout(workout)}
                                                        className="w-100"
                                                    >
                                                        <i className="fas fa-edit me-1"></i>
                                                        Edit
                                                    </Button>
                                                </div>
                                                <div className="col-6">
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => handleDeleteWorkout(workout._id)}
                                                        className="w-100"
                                                    >
                                                        <i className="fas fa-trash me-1"></i>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            {workout.status !== 'completed' && (
                                                <Button 
                                                    variant="success" 
                                                    size="sm"
                                                    onClick={() => handleCompleteWorkout(workout._id)}
                                                    className="w-100"
                                                >
                                                    <i className="fas fa-check me-1"></i>
                                                    Mark Complete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Add/Edit Workout Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-gradient">
                        <i className={`fas ${editingWorkout ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                        {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="pt-0">
                        <Form.Group className="mb-4">
                            <Form.Label>
                                <i className="fas fa-dumbbell text-gradient me-2"></i>
                                Workout Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter workout name (e.g., Morning Cardio, Strength Training)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>
                                <i className="fas fa-clock text-gradient me-2"></i>
                                Duration
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., 30 mins, 1 hour, 45 minutes"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <div className="d-grid gap-2 w-100">
                            <div className="row g-2">
                                <div className="col-6">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => setShowModal(false)}
                                        className="w-100"
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </Button>
                                </div>
                                <div className="col-6">
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        className="w-100"
                                    >
                                        <i className={`fas ${editingWorkout ? 'fa-save' : 'fa-plus'} me-2`}></i>
                                        {editingWorkout ? 'Update Workout' : 'Add Workout'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
            </Container>
        </main>
    );
}
