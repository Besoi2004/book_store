import { Link, useLocation } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";
import { FaBook, FaStar } from "react-icons/fa";
import { HiBell } from "react-icons/hi2";

import avatarImg from "../assets/avatar.png"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useGetUnreadCountQuery } from "../redux/features/notifications/notificationsApi";

const mainNavigation = [
    { name: "Trang chủ", href: "/", icon: "home" },
    { name: "Cửa hàng", href: "/shop", icon: "shop" },
    { name: "Tích điểm", href: "/points", icon: "points" },
    { name: "Liên hệ", href: "/contact", icon: "contact" },
]

const userNavigation = [
    { name: "Trang cá nhân", href: "/user/dashboard/profile" },
    { name: "Đơn hàng", href: "/user/dashboard/orders" },
    { name: "Yêu thích", href: "/user/dashboard/favorites" },
    { name: "Cài đặt", href: "/user/dashboard/settings" },
    { name: "Giỏ hàng", href: "/cart" },
]

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation();

    const cartItems = useSelector((state) => state.cart.cartItems);

    const { currentUser, logoutUser } = useAuth();
    
    // Get unread notifications count
    const { data: unreadData } = useGetUnreadCountQuery(currentUser?.email, {
        skip: !currentUser?.email,
        pollingInterval: 30000, // Poll every 30 seconds
    });
    const unreadCount = unreadData?.unreadCount || 0;
    
    const handleLogout =  () => {
        logoutUser();
    };

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const getNavIcon = (iconName) => {
        switch(iconName) {
            case "home":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            case "shop":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                )
            case "points":
                return <FaStar className="w-5 h-5" />
            case "contact":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                )
        }
    }

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
                : 'bg-white shadow-sm border-b border-gray-200'
        }`}>
            <div className="max-w-screen-2xl mx-auto px-6 py-4">
                <nav className='flex items-center'>
                    {/* Left - Logo (flex-1 để cân bằng với bên phải) */}
                    <div className="flex-1">
                        <Link to="/" className="flex items-center gap-2 group w-fit">
                            <div className="flex items-center gap-2">
                                <FaBook className="text-3xl text-secondary group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-2xl font-bold">
                                    <span className="text-gray-800">Tiệm Sách </span><span className="bg-gradient-to-r from-secondary via-deep-purple to-primary bg-clip-text text-transparent">Hư Vô</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center - Main Navigation (căn giữa tuyệt đối) */}
                    <div className="hidden md:flex items-center gap-2">
                        {mainNavigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const isPoints = item.href === '/points';
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="relative flex items-center gap-2 text-gray-700 hover:text-secondary font-semibold transition-all duration-300 group px-5 py-2.5 rounded-xl hover:bg-gray-50"
                                >
                                    {/* Ngôi sao bay cho Tích điểm */}
                                    {isPoints && (
                                        <>
                                            <FaStar className="absolute -top-2 -left-1 text-yellow-400 text-xs animate-float-up-down opacity-70" style={{ animationDelay: '0s' }} />
                                            <FaStar className="absolute -top-2 -right-1 text-yellow-300 text-xs animate-float-up-down opacity-60" style={{ animationDelay: '0.5s' }} />
                                            <FaStar className="absolute -bottom-2 left-2 text-yellow-400 text-xs animate-float-up-down opacity-50" style={{ animationDelay: '1s' }} />
                                            <FaStar className="absolute -bottom-2 right-2 text-yellow-300 text-xs animate-float-up-down opacity-70" style={{ animationDelay: '1.5s' }} />
                                        </>
                                    )}
                                    
                                    <span className="group-hover:scale-110 transition-transform duration-300 text-lg">
                                        {getNavIcon(item.icon)}
                                    </span>
                                    <span className={`relative text-base transition-all duration-300 group-hover:scale-105 ${
                                        isActive ? 'text-secondary font-bold' : ''
                                    }`}>
                                        {item.name}
                                        <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-secondary to-primary transition-all duration-300 ${
                                            isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}></span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right - Actions (flex-1 justify-end để cân bằng với logo bên trái) */}
                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
                        {/* Notifications Bell */}
                        <Link 
                            to="/notifications" 
                            className="relative p-3 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 rounded-full transition-all duration-300 group"
                        >
                            <HiBell className="size-7 text-gray-700 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-soft animate-pulse">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link 
                            to="/cart" 
                            className="relative p-3 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 rounded-full transition-all duration-300 group"
                        >
                            <HiOutlineShoppingCart className="size-7 text-gray-700 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-soft animate-pulse">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Login / User */}
                        <div className="relative flex items-center">
                            {
                                currentUser ? (
                                    <>
                                        <button 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                            className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 p-1 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 rounded-lg pr-2"
                                        >
                                            <div className="relative">
                                                <img 
                                                    src={currentUser?.avatar || avatarImg} 
                                                    alt="Avatar" 
                                                    className="size-11 rounded-full ring-2 ring-secondary shadow-soft hover:ring-primary transition-all duration-300" 
                                                />
                                                {/* Membership Tier Badge */}
                                                {currentUser?.tier && (
                                                    <span className={`absolute -bottom-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-white ${
                                                        currentUser.tier === 'diamond' ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white' :
                                                        currentUser.tier === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                                                        currentUser.tier === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                                        'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                                                    }`}>
                                                        {currentUser.tier === 'diamond' ? '💎' :
                                                         currentUser.tier === 'gold' ? '👑' :
                                                         currentUser.tier === 'silver' ? '⭐' : '🥉'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="hidden lg:flex flex-col items-start">
                                                <span className="text-sm font-semibold text-gray-800">{currentUser?.username || currentUser?.email?.split('@')[0]}</span>
                                                <span className="text-xs text-gray-500 capitalize">
                                                    {currentUser?.tier === 'diamond' ? 'Kim Cương' :
                                                     currentUser?.tier === 'gold' ? 'Vàng' :
                                                     currentUser?.tier === 'silver' ? 'Bạc' : 'Đồng'}
                                                </span>
                                            </div>
                                        </button>
                                        {/* Dropdown */}
                                        {isDropdownOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-30"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                ></div>
                                                <div className="absolute right-0 top-14 w-56 bg-white shadow-2xl rounded-2xl overflow-hidden z-40 border border-gray-100 animate-slideDown">
                                                    <div className="bg-gradient-to-r from-secondary to-deep-purple p-4 text-white">
                                                        <p className="font-semibold">Xin chào!</p>
                                                        <p className="text-sm opacity-90">{currentUser?.email}</p>
                                                    </div>
                                                    <ul className="py-2">
                                                        {userNavigation.map((item) => (
                                                            <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                                                                <Link 
                                                                    to={item.href} 
                                                                    className="block px-4 py-2.5 text-sm hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 transition-all duration-300 font-medium text-gray-700"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li className="border-t border-gray-100 mt-2 pt-2">
                                                            <button 
                                                                onClick={handleLogout} 
                                                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-Favorite/10 text-Favorite font-semibold transition-all duration-300"
                                                            >
                                                                Đăng xuất
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Link 
                                        to="/login" 
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary to-deep-purple text-white font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300 text-base"
                                    >
                                        <HiOutlineUser className="size-5" />
                                        <span className="hidden lg:block">Đăng nhập</span>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar