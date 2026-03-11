import axios from 'axios';
import React from 'react'
import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HiViewGridAdd } from 'react-icons/hi';
import { MdOutlineManageHistory, MdDashboard, MdHome, MdShoppingCart, MdEmail } from 'react-icons/md';
import { FiSettings, FiBell, FiLogOut } from 'react-icons/fi';
import { FaUsers, FaTicketAlt, FaCrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        // Decode JWT token to get admin info
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setAdminInfo({
                    username: payload.username || 'Admin',
                    role: payload.role || 'admin'
                });
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Đăng xuất thành công!');
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.includes(path);
    };

    const menuItems = [
        {
            path: '/dashboard',
            icon: <MdDashboard className="h-5 w-5" />,
            label: 'Dashboard',
            description: 'Tổng quan'
        },
        {
            path: '/dashboard/manage-books',
            icon: <MdOutlineManageHistory className="h-5 w-5" />,
            label: 'Quản lý sách',
            description: 'Danh sách & chỉnh sửa'
        },
        {
            path: '/dashboard/manage-orders',
            icon: <MdShoppingCart className="h-5 w-5" />,
            label: 'Quản lý đơn hàng',
            description: 'Đơn hàng & trạng thái'
        },
        {
            path: '/dashboard/manage-users',
            icon: <FaUsers className="h-5 w-5" />,
            label: 'Quản lý người dùng',
            description: 'Người dùng & vai trò'
        },
        {
            path: '/dashboard/manage-coupons',
            icon: <FaTicketAlt className="h-5 w-5" />,
            label: 'Quản lý mã giảm giá',
            description: 'Khuyến mãi & sự kiện'
        },
        {
            path: '/dashboard/manage-forms',
            icon: <MdEmail className="h-5 w-5" />,
            label: 'Quản lý yêu cầu',
            description: 'Liên hệ & yêu cầu sách'
        },
        {
            path: '/dashboard/manage-ranks',
            icon: <FaCrown className="h-5 w-5" />,
            label: 'Quản lý hạng',
            description: 'Hạng thành viên & quyền lợi'
        }
    ];

  return (
    <section className="flex md:bg-gray-100 min-h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
          <div className="flex items-center space-x-3">
            
            <div>
              <h2 className="text-white font-bold text-lg">Tiệm Sách Hư Vô</h2>
              <p className="text-purple-200 text-xs">Admin Panel</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex-grow flex flex-col justify-between">
          <nav className="flex flex-col px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-purple-400'}`}>
                  {item.icon}
                </span>
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-semibold ${isActive(item.path) ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive(item.path) ? 'text-purple-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-700 px-4 py-4">
            <Link to="/" className="flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300 mb-2">
              <MdHome className="h-5 w-5" />
              <span className="ml-3 text-sm font-medium">Về trang chủ</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow text-gray-800">
        {/* Header */}
        <header className="flex items-center h-16 px-6 sm:px-10 bg-white border-b border-gray-100 shadow-sm">
          {/* Mobile menu button */}
          <button className="block sm:hidden relative flex-shrink-0 p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full">
            <span className="sr-only">Menu</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          {/* Page breadcrumb / title area */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <span className="text-gray-400 text-sm font-medium">Admin Panel</span>
          </div>

          {/* Right Actions */}
          <div className="flex flex-shrink-0 items-center ml-auto space-x-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer">
              <span className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
                {adminInfo?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
              <div className="hidden md:flex md:flex-col leading-tight">
                <span className="font-semibold text-gray-800 text-sm">{adminInfo?.username || 'Admin'}</span>
                <span className="text-xs text-gray-400 capitalize">{adminInfo?.role || 'Admin'}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
              title="Đăng xuất"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden lg:inline text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 sm:p-10 space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
          <Outlet/>
        </main>
      </div>
    </section>
  )
}

export default DashboardLayout
