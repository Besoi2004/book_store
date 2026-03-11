const Rank = require('./rank.model');

// Get all ranks (public)
const getAllRanks = async (req, res) => {
    try {
        const ranks = await Rank.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json({
            success: true,
            data: ranks
        });
    } catch (error) {
        console.error('Error fetching ranks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch ranks'
        });
    }
};

// Get single rank by ID
const getRankById = async (req, res) => {
    try {
        const { id } = req.params;
        const rank = await Rank.findById(id);
        
        if (!rank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rank
        });
    } catch (error) {
        console.error('Error fetching rank:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rank'
        });
    }
};

// Get rank by user points
const getRankByPoints = async (req, res) => {
    try {
        const { points } = req.query;
        const userPoints = parseInt(points) || 0;
        
        const rank = await Rank.findOne({
            isActive: true,
            minPoints: { $lte: userPoints },
            $or: [
                { maxPoints: { $gte: userPoints } },
                { maxPoints: null }
            ]
        }).sort({ minPoints: -1 });
        
        if (!rank) {
            // Return bronze as default
            const defaultRank = await Rank.findOne({ name: 'bronze' });
            return res.status(200).json({
                success: true,
                data: defaultRank
            });
        }
        
        res.status(200).json({
            success: true,
            data: rank
        });
    } catch (error) {
        console.error('Error fetching rank by points:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rank'
        });
    }
};

// Create new rank (admin only)
const createRank = async (req, res) => {
    try {
        const { name, displayName, icon, minPoints, maxPoints, discountPercent, couponCode, benefits, color, order } = req.body;
        
        // Check if rank already exists
        const existingRank = await Rank.findOne({ name });
        if (existingRank) {
            return res.status(400).json({
                success: false,
                message: 'Rank with this name already exists'
            });
        }
        
        const newRank = new Rank({
            name,
            displayName,
            icon,
            minPoints: minPoints || 0,
            maxPoints,
            discountPercent: discountPercent || 0,
            couponCode,
            benefits: benefits || [],
            color,
            order: order || 0
        });
        
        await newRank.save();
        
        res.status(201).json({
            success: true,
            message: 'Rank created successfully',
            data: newRank
        });
    } catch (error) {
        console.error('Error creating rank:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create rank'
        });
    }
};

// Update rank (admin only)
const updateRank = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const rank = await Rank.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        
        if (!rank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Rank updated successfully',
            data: rank
        });
    } catch (error) {
        console.error('Error updating rank:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update rank'
        });
    }
};

// Delete rank (admin only)
const deleteRank = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the rank first to check if it's default
        const rank = await Rank.findById(id);
        
        if (!rank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }
        
        // Prevent deletion of default ranks
        if (rank.isDefault) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete default rank. You can only edit it.'
            });
        }
        
        await Rank.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Rank deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting rank:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete rank'
        });
    }
};

// Initialize default ranks (admin only, run once)
const initializeDefaultRanks = async (req, res) => {
    try {
        const existingRanks = await Rank.countDocuments();
        if (existingRanks > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ranks already initialized'
            });
        }
        
        const defaultRanks = [
            {
                name: 'bronze',
                displayName: 'Đồng',
                icon: '🥉',
                minPoints: 0,
                maxPoints: 499,
                discountPercent: 0,
                couponCode: '',
                benefits: [],
                color: 'from-amber-700 to-amber-900',
                order: 1,
                isDefault: true
            },
            {
                name: 'silver',
                displayName: 'Bạc',
                icon: '🥈',
                minPoints: 500,
                maxPoints: 1999,
                discountPercent: 5,
                couponCode: 'SILVER5',
                benefits: ['Giảm 5% mọi đơn hàng', 'Ưu tiên hỗ trợ'],
                color: 'from-gray-400 to-gray-600',
                order: 2,
                isDefault: true
            },
            {
                name: 'gold',
                displayName: 'Vàng',
                icon: '🥇',
                minPoints: 2000,
                maxPoints: 4999,
                discountPercent: 10,
                couponCode: 'GOLD10',
                benefits: ['Giảm 10% mọi đơn hàng', 'Miễn phí vận chuyển'],
                color: 'from-yellow-400 to-yellow-600',
                order: 3,
                isDefault: true
            },
            {
                name: 'diamond',
                displayName: 'Kim Cương',
                icon: '💎',
                minPoints: 5000,
                maxPoints: null,
                discountPercent: 15,
                couponCode: 'DIAMOND15',
                benefits: ['Giảm 15% mọi đơn hàng', 'Quà tặng độc quyền'],
                color: 'from-cyan-400 to-blue-600',
                order: 4,
                isDefault: true
            }
        ];
        
        await Rank.insertMany(defaultRanks);
        
        res.status(201).json({
            success: true,
            message: 'Default ranks initialized successfully',
            data: defaultRanks
        });
    } catch (error) {
        console.error('Error initializing ranks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize ranks'
        });
    }
};

module.exports = {
    getAllRanks,
    getRankById,
    getRankByPoints,
    createRank,
    updateRank,
    deleteRank,
    initializeDefaultRanks
};
