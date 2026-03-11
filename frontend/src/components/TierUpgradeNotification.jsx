import React, { useEffect, useState } from 'react'
import { FiAward, FiX } from 'react-icons/fi'

const TierUpgradeNotification = ({ show, tier, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    const tiers = {
        silver: { name: 'Bạc', color: 'from-gray-400 to-gray-600', emoji: '🥈' },
        gold: { name: 'Vàng', color: 'from-yellow-400 to-yellow-600', emoji: '🥇' },
        diamond: { name: 'Kim Cương', color: 'from-cyan-400 to-blue-600', emoji: '💎' }
    };

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    if (!show) return null;

    const tierInfo = tiers[tier] || tiers.silver;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 relative transform transition-all duration-500 ${isVisible ? 'scale-100' : 'scale-75'}`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Animated Badge */}
                    <div className="mb-6 relative">
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${tierInfo.color} shadow-lg animate-bounce`}>
                            <FiAward className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 text-4xl animate-pulse">
                            {tierInfo.emoji}
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        🎉 Chúc mừng! 🎉
                    </h2>
                    
                    {/* Message */}
                    <p className="text-lg text-gray-600 mb-4">
                        Bạn đã lên hạng
                    </p>
                    
                    {/* Tier Badge */}
                    <div className={`inline-block px-8 py-3 bg-gradient-to-r ${tierInfo.color} text-white rounded-full text-2xl font-bold shadow-lg mb-6`}>
                        Hạng {tierInfo.name}
                    </div>

                    {/* Benefits */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Quyền lợi mới của bạn:</p>
                        <ul className="text-sm text-gray-600 space-y-2 text-left">
                            {tier === 'silver' && (
                                <>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Giảm 5% cho mọi đơn hàng</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Ưu tiên hỗ trợ khách hàng</span>
                                    </li>
                                </>
                            )}
                            {tier === 'gold' && (
                                <>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Giảm 10% cho mọi đơn hàng</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Miễn phí vận chuyển toàn quốc</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Ưu tiên xử lý đơn hàng</span>
                                    </li>
                                </>
                            )}
                            {tier === 'diamond' && (
                                <>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Giảm 15% cho mọi đơn hàng</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Miễn phí vận chuyển & đổi trả</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Quà tặng độc quyền hàng tháng</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        <span>Trải nghiệm VIP toàn diện</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        Tuyệt vời!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TierUpgradeNotification;
