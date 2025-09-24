import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.js';
import Home from './pages/Home.js';
import Error from './pages/Error.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Workouts from './pages/Workouts.js';
import API_BASE_URL from './config/api.js';

import './App.css';
import UserProvider from './context/UserContext.js';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (typeof data.user !== "undefined") {
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
        .catch(err => {
            console.error('Error fetching user details:', err);
            setUser({
                id: null,
                isAdmin: null
            });
        });
    }, []);

    useEffect(() => {
        console.log('User state:', user);
        console.log('Token:', localStorage.getItem('token'));
    }, [user]);

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
            <Router>
                <AppNavbar />
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;