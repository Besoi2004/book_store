import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { currentUser,loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }
    
    if (currentUser) {
        return children
    }

    return <Navigate to="/login" replace />
};

export default PrivateRoute
