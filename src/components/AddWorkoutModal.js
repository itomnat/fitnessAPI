import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

export default function AddWorkoutModal({ show, onHide, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        duration: ''
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // Validation to enable save button when all fields are populated
        if (formData.name.trim() !== '' && formData.duration.trim() !== '') {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            onSave(formData);
            setFormData({ name: '', duration: '' }); // Reset form
        }
    };

    const handleClose = () => {
        setFormData({ name: '', duration: '' }); // Reset form
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Workout</Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="workoutName" className="mb-3">
                        <Form.Label>Workout Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="e.g., Morning Run, Weight Training"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="workoutDuration" className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                            type="text"
                            name="duration"
                            placeholder="e.g., 30 minutes, 1 hour"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit"
                        disabled={!isValid}
                    >
                        Save Workout
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
