import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext.js';
import AddWorkoutModal from '../components/AddWorkoutModal.js';
import EditWorkoutModal from '../components/EditWorkoutModal.js';
import API_BASE_URL from '../config/api.js';

export default function Workouts() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    
    const [workouts, setWorkouts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = () => {
        fetch(`${API_BASE_URL}/workouts/get`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.workouts) {
                setWorkouts(data.workouts);
            } else {
                setWorkouts([]);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching workouts:', err);
            notyf.error('Failed to fetch workouts');
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchWorkouts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Redirect to login if user is not authenticated
    if (user.id === null) {
        return <Navigate to="/login" />;
    }

    const handleAddWorkout = (workoutData) => {
        fetch(`${API_BASE_URL}/workouts/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(workoutData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            notyf.success('Workout added successfully!');
            setShowAddModal(false);
            fetchWorkouts(); // Refresh the workouts list
        })
        .catch(err => {
            console.error('Error adding workout:', err);
            notyf.error('Failed to add workout');
        });
    };

    const handleEditWorkout = (workoutData) => {
        fetch(`${API_BASE_URL}/workouts/update?id=${selectedWorkout._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(workoutData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            notyf.success('Workout updated successfully!');
            setShowEditModal(false);
            setSelectedWorkout(null);
            fetchWorkouts(); // Refresh the workouts list
        })
        .catch(err => {
            console.error('Error updating workout:', err);
            notyf.error('Failed to update workout');
        });
    };

    const handleDeleteWorkout = (workoutId) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            fetch(`${API_BASE_URL}/workouts/delete?id=${workoutId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                notyf.success('Workout deleted successfully!');
                fetchWorkouts(); // Refresh the workouts list
            })
            .catch(err => {
                console.error('Error deleting workout:', err);
                notyf.error('Failed to delete workout');
            });
        }
    };

    const handleCompleteWorkout = (workoutId) => {
        fetch(`${API_BASE_URL}/workouts/complete?id=${workoutId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            notyf.success('Workout marked as completed!');
            fetchWorkouts(); // Refresh the workouts list
        })
        .catch(err => {
            console.error('Error completing workout:', err);
            notyf.error('Failed to complete workout');
        });
    };

    const openEditModal = (workout) => {
        setSelectedWorkout(workout);
        setShowEditModal(true);
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
            <Container className="fade-in">
                <div className="loading-container">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading your workouts...</p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="fade-in">
            <div className="page-header">
                <h1 className="page-title">My Workouts</h1>
                <Button 
                    variant="primary" 
                    onClick={() => setShowAddModal(true)}
                    id="addWorkout"
                    size="lg"
                >
                    ➕ Add Workout
                </Button>
            </div>

            {workouts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💪</div>
                    <h3 className="empty-state-title">No workouts yet!</h3>
                    <p className="empty-state-description">
                        Start your fitness journey by adding your first workout. Every great achievement begins with a single step!
                    </p>
                    <Button 
                        variant="primary" 
                        size="lg"
                        onClick={() => setShowAddModal(true)}
                    >
                        Create Your First Workout
                    </Button>
                </div>
            ) : (
                <div className="workout-grid">
                    {workouts.map((workout, index) => (
                        <Card 
                            key={workout._id} 
                            className={`workout-card ${workout.status === 'completed' ? 'completed' : ''} slide-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <Card.Title className="mb-0 text-gradient">{workout.name}</Card.Title>
                                    <Badge 
                                        className={workout.status === 'completed' ? 'badge-success' : 'badge-warning'}
                                    >
                                        {workout.status}
                                    </Badge>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="me-2">⏱️</span>
                                        <strong>Duration:</strong>
                                        <span className="ms-2">{workout.duration}</span>
                                    </div>
                                    
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">📅</span>
                                        <strong>Date Added:</strong>
                                        <span className="ms-2">{formatDate(workout.dateAdded)}</span>
                                    </div>
                                </div>
                                
                                <div className="d-flex flex-wrap gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => openEditModal(workout)}
                                    >
                                        ✏️ Edit
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDeleteWorkout(workout._id)}
                                    >
                                        🗑️ Delete
                                    </Button>
                                    
                                    {workout.status !== 'completed' && (
                                        <Button 
                                            variant="outline-success" 
                                            size="sm"
                                            onClick={() => handleCompleteWorkout(workout._id)}
                                        >
                                            ✅ Complete
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            <AddWorkoutModal 
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSave={handleAddWorkout}
            />

            <EditWorkoutModal 
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setSelectedWorkout(null);
                }}
                onSave={handleEditWorkout}
                workout={selectedWorkout}
            />
        </Container>
    );
}
