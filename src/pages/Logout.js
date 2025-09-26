import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
    const { unsetUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user data and redirect to login
        unsetUser();
        navigate('/login');
    }, [unsetUser, navigate]);

    return null; // This component doesn't render anything
}
