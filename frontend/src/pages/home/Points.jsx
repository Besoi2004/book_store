import React, { useState } from 'react';
import { FaStar, FaGift, FaCrown, FaCheckCircle, FaBolt, FaLock, FaChartLine } from 'react-icons/fa';
import Loading from '../../components/Loading';
import { useFetchAllRanksQuery } from '../../redux/features/ranks/ranksApi';
import { useRevealRankCouponMutation } from '../../redux/features/users/usersApi';
import { useAuth } from '../../context/AuthContext';
import { getRankColor } from '../../utils/rankColors';
import Swal from 'sweetalert2';

const Points = () => {
    const { currentUser } = useAuth();
    const [revealingRankId, setRevealingRankId] = useState(null);
    
    // Fetch ranks from API
    const { data: ranksData, isLoading } = useFetchAllRanksQuery();
    const [revealRankCoupon] = useRevealRankCouponMutation();
    const membershipTiers = ranksData?.data || [];

    // User's current points and revealed coupons
    const userPoints = currentUser?.rewardPoints || 0;
    const revealedCoupons = currentUser?.revealedRankCoupons || [];
    
    // Handle revealing a rank coupon
    const handleRevealCoupon = async (rank) => {
        if (!currentUser?.email) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng đăng nhập',
                text: 'Bạn cần đăng nhập để mở hộp quà!',
                confirmButtonColor: '#3085d6',
            });
            return;
        }
        
        setRevealingRankId(rank._id);
        
        try {
            const result = await revealRankCoupon({ 
                email: currentUser.email, 
                rankId: rank._id 
            }).unwrap();
            
            // Show success animation
            Swal.fire({
                icon: 'success',
                title: '🎉 Chúc mừng!',
                html: `
                    <div class="text-center">
                        <p class="text-lg mb-3">Bạn đã mở hộp quà thành công!</p>
                        <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-400">
                            <p class="text-sm text-gray-600 mb-2">Mã giảm giá của bạn:</p>
                            <p class="text-2xl font-bold text-orange-600">${result.couponCode}</p>
                        </div>
                        <p class="text-sm text-gray-500 mt-3">Sao chép và sử dụng mã này khi thanh toán!</p>
                    </div>
                `,
                confirmButtonColor: '#f59e0b',
                confirmButtonText: 'Tuyệt vời!',
            });
        } catch (error) {
            console.error('Failed to reveal coupon:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.data?.message || 'Không thể mở hộp quà. Vui lòng thử lại!',
                confirmButtonColor: '#d33',
            });
        } finally {
            setRevealingRankId(null);
        }
    };
    
    // Check if user can reveal a rank
    const canReveal = (rank) => {
        return userPoints >= rank.minPoints && !revealedCoupons.includes(rank.couponCode);
    };
    
    // Check if rank is revealed
    const isRevealed = (rank) => {
        return revealedCoupons.includes(rank.couponCode);
    };
    
    // Check if rank is locked
    const isLocked = (rank) => {
        return userPoints < rank.minPoints;
    };
    
    // Helper function to get background color based on rank name - using light color for cards
    const getBgColor = (name) => {
        const bgColors = {
            'bronze': 'bg-amber-50',
            'silver': 'bg-gray-50',
            'gold': 'bg-yellow-50',
            'diamond': 'bg-cyan-50'
        };
        return bgColors[name] || 'bg-gray-50';
    };
    
    // Helper function to get border color
    const getBorderColor = (name) => {
        const borderColors = {
            'bronze': 'border-amber-300',
            'silver': 'border-gray-300',
            'gold': 'border-yellow-300',
            'diamond': 'border-cyan-300'
        };
        return borderColors[name] || 'border-gray-300';
    };
    
    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-br from-soft-blue via-white to-soft-purple">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            </div>

            {/* Nội dung chính */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-16 animate-fadeIn">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <FaStar className="text-6xl text-yellow-500" />
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-deep-purple bg-clip-text text-transparent">
                            Điểm Thưởng
                        </h1>
                        <FaGift className="text-6xl text-pink-500" />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Tích điểm với mỗi đơn hàng - Đổi quà liền tay - Thăng hạng nhanh chóng
                    </p>
                </div>

                {/* Membership Tiers */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                        <FaCrown className="text-yellow-500" />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Hạng Thành Viên
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {membershipTiers.map((tier, index) => (
                            <div
                                key={tier._id || index}
                                className={`${getBgColor(tier.name)} rounded-2xl p-6 shadow-xl border-2 ${getBorderColor(tier.name)} hover:scale-105 transition-transform duration-300 relative`}
                            >
                                {/* Lock badge for unreached ranks */}
                                {isLocked(tier) && (
                                    <div className="absolute top-4 right-4 bg-gray-500 text-white p-2 rounded-full">
                                        <FaLock className="text-sm" />
                                    </div>
                                )}
                                
                                <div className="text-center mb-4">
                                    <div className="text-6xl mb-2">{tier.icon}</div>
                                    <h3 className={`text-2xl font-bold ${getRankColor(tier.name).lightText}`}>
                                        {tier.displayName}
                                    </h3>
                                    <p className="text-sm text-gray-600 font-semibold mt-2">
                                        {tier.minPoints} - {tier.maxPoints || '∞'} điểm
                                    </p>
                                    <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        {tier.discountPercent}% giảm giá
                                    </div>
                                </div>
                                
                                {/* Benefits */}
                                <div className="space-y-2 mb-4">
                                    {tier.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Gift Box Section */}
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                                    {isLocked(tier) ? (
                                        // Locked state - rank not reached yet
                                        <div className="text-center">
                                            <div className="text-4xl mb-2 opacity-40">
                                                🔒
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Đạt {tier.minPoints} điểm để mở
                                            </p>
                                        </div>
                                    ) : isRevealed(tier) ? (
                                        // Revealed state - show coupon code
                                        <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-300">
                                            <p className="text-xs text-gray-600 mb-1">Mã giảm giá:</p>
                                            <p className="text-lg font-bold text-orange-600 select-all">
                                                {tier.couponCode}
                                            </p>
                                            <p className="text-xs text-blue-600 font-semibold mt-1">
                                                {(tier.couponDiscountType === 'percent' || !tier.couponDiscountType) && tier.couponDiscountPercent > 0
                                                    ? `Giảm ${tier.couponDiscountPercent}%`
                                                    : tier.couponDiscountType === 'amount' && tier.couponDiscountAmount > 0
                                                    ? `Giảm ${tier.couponDiscountAmount.toLocaleString('vi-VN')}₫`
                                                    : ''}
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">✓ Đã mở</p>
                                        </div>
                                    ) : (
                                        // Can reveal - show gift box button
                                        <div className="text-center">
                                            <button
                                                onClick={() => handleRevealCoupon(tier)}
                                                disabled={revealingRankId === tier._id}
                                                className={`
                                                    w-full py-3 rounded-lg font-bold text-white
                                                    bg-gradient-to-r from-pink-500 to-orange-500
                                                    hover:from-pink-600 hover:to-orange-600
                                                    transform hover:scale-105 transition-all
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    flex items-center justify-center gap-2
                                                    animate-pulse-slow
                                                `}
                                            >
                                                {revealingRankId === tier._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span>Đang mở...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaGift className="text-xl" />
                                                        <span>Mở hộp quà</span>
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Nhấn để nhận mã giảm giá
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guide Section */}

            </div>
        </div>
    );
};

export default Points;
