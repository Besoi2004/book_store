import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiUser, FiAward } from 'react-icons/fi';

/**
 * Component demo hiển thị thông tin user và sync status
 * Sử dụng để test hệ thống đồng bộ dữ liệu
 */
const UserSyncDemo = () => {
    const { currentUser, refreshUserData } = useAuth();
    const [syncing, setSyncing] = React.useState(false);
    const [lastSyncTime, setLastSyncTime] = React.useState(null);

    const handleManualSync = async () => {
        setSyncing(true);
        await refreshUserData();
        setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));
        setSyncing(false);
    };

    if (!currentUser) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Vui lòng đăng nhập để xem demo</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">User Sync Demo</h2>
                    <button
                        onClick={handleManualSync}
                        disabled={syncing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FiRefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}
                    </button>
                </div>

                {lastSyncTime && (
                    <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        ✓ Đã đồng bộ lúc: {lastSyncTime}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FiUser className="text-gray-600" />
                            <h3 className="font-semibold text-gray-700">Thông tin cơ bản</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-500">Email:</span>
                                <span className="ml-2 font-medium">{currentUser.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Tên:</span>
                                <span className="ml-2 font-medium">{currentUser.username || 'Chưa cập nhật'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Phone:</span>
                                <span className="ml-2 font-medium">{currentUser.phone || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reward Info */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <FiAward className="text-purple-600" />
                            <h3 className="font-semibold text-gray-700">Điểm thưởng & Hạng</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-500">Điểm thưởng:</span>
                                <span className="ml-2 font-bold text-purple-600">{currentUser.rewardPoints || 0} điểm</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Hạng thành viên:</span>
                                <span className="ml-2 font-bold text-purple-600">
                                    {currentUser.tier === 'diamond' ? '💎 Kim Cương' :
                                     currentUser.tier === 'gold' ? '👑 Vàng' :
                                     currentUser.tier === 'silver' ? '⭐ Bạc' :
                                     '🥉 Đồng'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Raw Data Display */}
                <details className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                        Xem dữ liệu raw (debug)
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto bg-gray-800 text-green-400 p-3 rounded">
                        {JSON.stringify({
                            email: currentUser.email,
                            username: currentUser.username,
                            rewardPoints: currentUser.rewardPoints,
                            tier: currentUser.tier,
                            phone: currentUser.phone,
                            address: currentUser.address,
                            city: currentUser.city,
                            country: currentUser.country,
                        }, null, 2)}
                    </pre>
                </details>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <h4 className="font-semibold text-blue-900 mb-2">Cách test đồng bộ:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Thay đổi dữ liệu trong database (ví dụ: tăng điểm thưởng)</li>
                        <li>Click nút "Đồng bộ ngay" để fetch dữ liệu mới</li>
                        <li>Hoặc đợi 5 phút để auto-sync tự động chạy</li>
                        <li>Dữ liệu sẽ được cập nhật trên toàn bộ app</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default UserSyncDemo;
