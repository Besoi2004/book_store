import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX, FiCamera, FiAward, FiTrendingUp } from 'react-icons/fi'
import axios from 'axios'
import getBaseUrl from '../../utils/baseURL'
import { useFetchAllRanksQuery, useFetchRankByPointsQuery } from '../../redux/features/ranks/ranksApi'
import { getRankColor, getRankProgressColor } from '../../utils/rankColors';

const UserProfile = () => {
    const { currentUser, refreshUserData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);
    const [profileData, setProfileData] = useState({
        username: '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        country: 'Việt Nam',
        avatar: ''
    });
    const [phoneError, setPhoneError] = useState('');

    // Fetch ranks from API
    const { data: ranksData, isLoading: ranksLoading } = useFetchAllRanksQuery();
    const ranks = ranksData?.data || [];
    
    // Get current user's rank
    const currentPoints = currentUser?.rewardPoints || 0;
    const { data: currentRankData } = useFetchRankByPointsQuery(currentPoints, {
        skip: !currentUser
    });
    const currentRankInfo = currentRankData?.data;
    
    // Find next rank
    const currentRankIndex = ranks.findIndex(r => r.name === currentRankInfo?.name);
    const nextRank = currentRankIndex >= 0 && currentRankIndex < ranks.length - 1 
        ? ranks[currentRankIndex + 1] 
        : null;

    // Sync profile data from currentUser when it changes
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                username: currentUser.username || currentUser.displayName || 'Người dùng',
                email: currentUser.email,
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                ward: currentUser.ward || '',
                district: currentUser.district || '',
                city: currentUser.city || '',
                country: currentUser.country || 'Việt Nam',
                avatar: currentUser.avatar || currentUser.photoURL || ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            // Only allow digits, max 10
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setProfileData(prev => ({ ...prev, phone: digits }));
            if (digits.length > 0 && digits.length !== 10) {
                setPhoneError('Số điện thoại phải đúng 10 chữ số');
            } else {
                setPhoneError('');
            }
            return;
        }
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showNotification('Kích thước ảnh không được vượt quá 2MB', 'error');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                showNotification('Vui lòng chọn file ảnh', 'error');
                return;
            }

            // Convert to base64 for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    avatar: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async () => {
        if (profileData.phone && profileData.phone.length !== 10) {
            setPhoneError('Số điện thoại phải đúng 10 chữ số');
            return;
        }
        try {
            setLoading(true);
            
            const response = await axios.put(
                `${getBaseUrl()}/api/users/${currentUser.email}`,
                profileData
            );
            
            // Refresh user data from database to sync across all components
            await refreshUserData();
            
            setIsEditing(false);
            showNotification('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification(
                error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin', 
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to current user data
        if (currentUser) {
            setProfileData({
                username: currentUser.username || currentUser.displayName || 'Người dùng',
                email: currentUser.email,
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                ward: currentUser.ward || '',
                district: currentUser.district || '',
                city: currentUser.city || '',
                country: currentUser.country || 'Việt Nam',
                avatar: currentUser.avatar || currentUser.photoURL || ''
            });
        }
        setPhoneError('');
        setIsEditing(false);
    };

    const createdDate = currentUser?.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('vi-VN')
        : 'Không xác định';

    // Calculate progress to next tier
    const progressToNextTier = nextRank 
        ? ((currentPoints - (currentRankInfo?.minPoints || 0)) / ((nextRank.minPoints || 0) - (currentRankInfo?.minPoints || 0))) * 100
        : 100;
    
    const pointsToNextTier = nextRank 
        ? (nextRank.minPoints || 0) - currentPoints
        : 0;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Vui lòng đăng nhập để xem thông tin</div>
            </div>
        );
    }

    if (ranksLoading || !currentRankInfo) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-fade-in-down ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300"
                        >
                            <FiSave className="w-4 h-4" />
                            <span>Lưu</span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
                        >
                            <FiX className="w-4 h-4" />
                            <span>Hủy</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Avatar and Tier Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-gray-200">
                    <div className="relative">
                        <div 
                            onClick={handleAvatarClick}
                            className={`relative ${getRankColor(currentRankInfo?.name).bg} rounded-full p-1 ${isEditing ? 'cursor-pointer' : ''}`}
                        >
                            {profileData.avatar ? (
                                <img 
                                    src={profileData.avatar} 
                                    alt="Avatar" 
                                    className="w-24 h-24 rounded-full object-cover bg-white"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                                    <FiUser className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <FiCamera className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{profileData.username}</h3>
                        <p className="text-gray-500">{profileData.email}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <FiCalendar className="w-4 h-4" />
                            <span>Tham gia ngày: {createdDate}</span>
                        </div>

                        {/* Tier Badge */}
                        <div className="mt-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 ${getRankColor(currentRankInfo?.name).bg} ${getRankColor(currentRankInfo?.name).text} rounded-full shadow-lg`}>
                                <span className="text-xl">{currentRankInfo?.icon}</span>
                                <span className="font-bold">Hạng {currentRankInfo?.displayName}</span>
                                <span className="text-sm opacity-90">({currentRankInfo?.discountPercent}% giảm giá)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Points and Tier Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Points Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <FiTrendingUp className="w-8 h-8" />
                            <div>
                                <p className="text-sm opacity-90">Điểm tích lũy</p>
                                <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-sm opacity-90">
                            Hoàn thành đơn hàng để nhận thêm điểm thưởng!
                        </p>
                    </div>

                    {/* Tier Progress Card */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                        <h4 className="font-bold text-gray-800 mb-3">Tiến độ hạng thành viên</h4>
                        {nextRank ? (
                            <>
                                <div className="mb-2">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span className="flex items-center gap-1">
                                            <span>{currentRankInfo?.icon}</span>
                                            <span>Hạng {currentRankInfo?.displayName}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span>{nextRank.icon}</span>
                                            <span>Hạng {nextRank.displayName}</span>
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${getRankProgressColor(currentRankInfo?.name)} transition-all duration-500`}
                                            style={{ width: `${Math.min(Math.max(progressToNextTier, 0), 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Còn <span className="font-bold text-purple-600">{pointsToNextTier.toLocaleString()}</span> điểm để lên hạng tiếp theo
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <FiAward className="w-12 h-12 text-cyan-500 mx-auto mb-2" />
                                <p className="text-gray-600">Bạn đã đạt hạng cao nhất! 🎉</p>
                                <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                                    <p className="text-sm text-gray-600">Tiếp tục mua sắm để tích lũy điểm!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                disabled
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Nhập số điện thoại (10 số)"
                            maxLength={10}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                phoneError ? 'border-red-400 bg-red-50' :
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                        {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thành phố / Tỉnh
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Nhập thành phố"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quận / Huyện
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={profileData.district}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Nhập quận / huyện"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phường / Xã
                        </label>
                        <input
                            type="text"
                            name="ward"
                            value={profileData.ward}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Nhập phường / xã"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Địa chỉ (số nhà, tên đường)
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Nhập địa chỉ chi tiết"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quốc gia
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                    </div>
                </div>

                {/* Tier Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiAward className="w-5 h-5" />
                        Quyền lợi theo hạng thành viên
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
                                <span className="font-semibold text-gray-800">Hạng Bạc (500 điểm)</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Giảm 5% mọi đơn hàng</li>
                                <li>• Ưu tiên hỗ trợ</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                                <span className="font-semibold text-gray-800">Hạng Vàng (2000 điểm)</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Giảm 10% mọi đơn hàng</li>
                                <li>• Miễn phí vận chuyển</li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"></div>
                                <span className="font-semibold text-gray-800">Hạng Kim Cương (5000 điểm)</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Giảm 15% mọi đơn hàng</li>
                                <li>• Quà tặng độc quyền</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
