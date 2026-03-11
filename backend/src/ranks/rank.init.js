const Rank = require('./rank.model');

/**
 * Auto-initialize default ranks on server startup if none exist
 */
const autoInitializeRanks = async () => {
    try {
        const existingRanks = await Rank.countDocuments();
        
        // If ranks already exist, skip initialization
        if (existingRanks > 0) {
            console.log(`✅ Found ${existingRanks} existing rank(s) in database`);
            return;
        }
        
        console.log('📝 No ranks found. Initializing default ranks...');
        
        const defaultRanks = [
            {
                name: 'bronze',
                displayName: 'Đồng',
                icon: '🥉',
                minPoints: 0,
                maxPoints: 499,
                discountPercent: 0,
                couponCode: '',
                benefits: [
                    'Tích điểm cho mỗi đơn hàng',
                    'Nhận thông báo về sách mới',
                    'Tham gia các chương trình khuyến mãi'
                ],
                color: 'from-amber-600 to-amber-400',
                order: 1,
                isDefault: true,
                isActive: true
            },
            {
                name: 'silver',
                displayName: 'Bạc',
                icon: '🥈',
                minPoints: 500,
                maxPoints: 1999,
                discountPercent: 5,
                couponCode: 'SILVER5',
                benefits: [
                    'Giảm 5% mọi đơn hàng',
                    'Ưu tiên hỗ trợ khách hàng',
                    'Tất cả quyền lợi hạng Đồng'
                ],
                color: 'from-gray-400 to-gray-300',
                order: 2,
                isDefault: true,
                isActive: true
            },
            {
                name: 'gold',
                displayName: 'Vàng',
                icon: '🥇',
                minPoints: 2000,
                maxPoints: 4999,
                discountPercent: 10,
                couponCode: 'GOLD10',
                benefits: [
                    'Giảm 10% mọi đơn hàng',
                    'Miễn phí vận chuyển',
                    'Tất cả quyền lợi hạng Bạc'
                ],
                color: 'from-yellow-500 to-yellow-300',
                order: 3,
                isDefault: true,
                isActive: true
            },
            {
                name: 'diamond',
                displayName: 'Kim cương',
                icon: '💎',
                minPoints: 5000,
                maxPoints: null,
                discountPercent: 15,
                couponCode: 'DIAMOND15',
                benefits: [
                    'Giảm 15% mọi đơn hàng',
                    'Quà tặng độc quyền',
                    'Tất cả quyền lợi hạng Vàng'
                ],
                color: 'from-cyan-500 to-blue-400',
                order: 4,
                isDefault: true,
                isActive: true
            }
        ];
        
        const createdRanks = await Rank.insertMany(defaultRanks);
        
        console.log('✨ Successfully initialized default ranks:');
        createdRanks.forEach(rank => {
            console.log(`   ${rank.icon} ${rank.displayName}: ${rank.minPoints}-${rank.maxPoints || '∞'} điểm (${rank.discountPercent}% off)`);
        });
        
    } catch (error) {
        console.error('❌ Error auto-initializing ranks:', error.message);
        // Don't throw error - server should still start even if rank init fails
    }
};

module.exports = { autoInitializeRanks };
