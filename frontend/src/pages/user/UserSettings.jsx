import React, { useState } from 'react'
import { FiLock, FiEye, FiEyeOff, FiBell, FiMail } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/AuthContext'

const UserSettings = () => {
    const { changePassword, currentUser } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotions: false,
        newsletter: true
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationToggle = (name) => {
        setNotifications(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Vui lòng đăng nhập để thay đổi mật khẩu!',
            });
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu mới và xác nhận mật khẩu không khớp!',
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Mật khẩu mới phải có ít nhất 6 ký tự!',
            });
            return;
        }

        setIsChangingPassword(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Đã thay đổi mật khẩu thành công!',
                timer: 2000,
                showConfirmButton: false
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            let errorMessage = 'Có lỗi xảy ra khi thay đổi mật khẩu!';
            
            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Mật khẩu hiện tại không đúng!';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Mật khẩu mới quá yếu!';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Vui lòng đăng xuất và đăng nhập lại để thay đổi mật khẩu!';
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: errorMessage,
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleSaveNotifications = () => {
        // TODO: Implement save notification preferences
        console.log('Saving notifications:', notifications);
        
        Swal.fire({
            icon: 'success',
            title: 'Đã lưu!',
            text: 'Cài đặt thông báo đã được cập nhật!',
            timer: 1500,
            showConfirmButton: false
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt tài khoản</h2>
            </div>

            {/* Change Password Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                        <FiLock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Thay đổi mật khẩu</h3>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập mật khẩu hiện tại"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nhập lại mật khẩu mới"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            </div>

            {/* Notification Settings */}

        </div>
    )
}

export default UserSettings
