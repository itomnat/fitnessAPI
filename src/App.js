import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
// import AppNavbar from './components/AppNavbar';
// import Home from './pages/Home';
// import Error from './pages/Error';
import Login from './pages/Login';
// import Logout from './pages/Logout';
import Register from './pages/Register';


import './App.css';
import UserProvider from './context/UserContext';

function App() {

    const [user, setUser] = useState({
      id: null,
      isAdmin: null
    });

    const unsetUser = () => {

      localStorage.clear();

    };


    console.log(localStorage.getItem('token'))

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser({
                id: null,
                isAdmin: null
            });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL || 'https://fitnessapp-api-ln8u.onrender.com'}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
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
        .catch(error => {
            console.error('Error fetching user details:', error);
            setUser({
                id: null,
                isAdmin: null
            });
        });
    }, []);

    //   useEffect(() => {
    //   fetch(`http://localhost:4000/users/details`, {
    //   headers: {
    //       Authorization: `Bearer ${ localStorage.getItem('token') }`
    //   }
    //   })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)

    //   // Set the user states values with the user details upon successful login.
    //   if (typeof data !== "undefined") {

    //       setUser({
    //       id: data._id,
    //       isAdmin: data.isAdmin
    //       });

    //   // Else set the user states to the initial values
    //   } else {

    //       setUser({
    //       id: null
    //       });

    //     }

    //     })
    // }, [])

  useEffect(() => {
      console.log(user);
      console.log(localStorage);
  }, [user])

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        {/*<AppNavbar />*/}
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/*<Routes path="/" element={<Home />} />*/}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/*<Routes path="/logout" element={<Logout />} />*/}
            {/*<Routes path="*" element={<Error />} />*/}
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;