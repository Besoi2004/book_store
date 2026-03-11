import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Component này chỉ để redirect - Admin giờ đăng nhập ở trang /login
const AdminLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login page
        navigate('/login', { replace: true });
    }, [navigate]);

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='text-center'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className='text-gray-600'>Đang chuyển hướng đến trang đăng nhập...</p>
            </div>
        </div>
    );
}

export default AdminLogin