import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const UserDashboard = () => {
    const location = useLocation();
    const { currentUser, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
    }

    const menuItems = [
        {
            path: '/user/dashboard/profile',
            icon: <FiUser className="w-5 h-5" />,
            label: 'Thông tin cá nhân'
        },
        {
            path: '/user/dashboard/orders',
            icon: <FiShoppingBag className="w-5 h-5" />,
            label: 'Đơn hàng của tôi'
        },
        {
            path: '/user/dashboard/favorites',
            icon: <FiHeart className="w-5 h-5" />,
            label: 'Sách yêu thích'
        },
        {
            path: '/user/dashboard/settings',
            icon: <FiSettings className="w-5 h-5" />,
            label: 'Cài đặt'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Xin chào, {currentUser?.email?.split('@')[0]}!</h1>
                            <p className="text-purple-100">Chào mừng bạn đến với trang cá nhân</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <FiUser className="w-12 h-12" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3">
                                        <FiUser className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{currentUser?.email?.split('@')[0]}</p>
                                        <p className="text-sm text-gray-500">{currentUser?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="p-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                                            location.pathname === item.path
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                                
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-4"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    <span className="font-medium">Đăng xuất</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
