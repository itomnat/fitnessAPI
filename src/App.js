import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import './App.css';
import UserContext, { UserProvider } from './context/UserContext';
import API_BASE_URL from './config/api';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_BASE_URL}/users/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.user && data.user._id) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin
                    });
                } else {
                    setUser({
                        id: null,
                        isAdmin: null
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                setUser({
                    id: null,
                    isAdmin: null
                });
            });
        }
    }, []);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;