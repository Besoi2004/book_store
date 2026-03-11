import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Đang tải...</p>
                </div>
            </div>
        );
    }
    
    if (currentUser) {
        return children;
    }

    return <Navigate to="/login" replace />;
};

export default PrivateRoute
