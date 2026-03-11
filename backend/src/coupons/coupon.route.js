const express = require('express');
const Coupon = require('./coupon.model');
const User = require('../users/user.model');
const Rank = require('../ranks/rank.model');
const router = express.Router();

// Get all coupons (Admin)
router.get("/", async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.status(200).json(coupons);
    } catch (error) {
        console.error("Failed to get coupons", error);
        res.status(500).send({ message: "Failed to get coupons" });
    }
});

// Get active coupons only (Public)
router.get("/active", async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        });
        return res.status(200).json(coupons);
    } catch (error) {
        console.error("Failed to get active coupons", error);
        res.status(500).send({ message: "Failed to get active coupons" });
    }
});

// Get coupon by code (Public - for validation)
router.get("/validate/:code", async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        
        if (!coupon) {
            return res.status(404).json({ 
                valid: false,
                message: "Mã giảm giá không tồn tại!" 
            });
        }
        
        if (!coupon.isValid()) {
            let message = "Mã giảm giá không hợp lệ!";
            if (!coupon.isActive) {
                message = "Mã giảm giá đã bị vô hiệu hóa!";
            } else if (new Date() < coupon.startDate) {
                message = "Mã giảm giá chưa bắt đầu!";
            } else if (new Date() > coupon.endDate) {
                message = "Mã giảm giá đã hết hạn!";
            } else if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                message = "Mã giảm giá đã hết lượt sử dụng!";
            }
            return res.status(400).json({ 
                valid: false,
                message 
            });
        }
        
        return res.status(200).json({
            valid: true,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minPurchase: coupon.minPurchase,
                maxDiscount: coupon.maxDiscount
            }
        });
    } catch (error) {
        console.error("Failed to validate coupon", error);
        res.status(500).send({ message: "Failed to validate coupon" });
    }
});

// Create new coupon (Admin)
router.post("/", async (req, res) => {
    try {
        const couponData = req.body;
        
        // Validate discount value
        if (couponData.discountType === 'percentage' && couponData.discountValue > 100) {
            return res.status(400).json({ message: "Phần trăm giảm giá không được vượt quá 100%" });
        }
        
        // Check if code already exists
        const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Mã giảm giá đã tồn tại!" });
        }
        
        const newCoupon = new Coupon(couponData);
        await newCoupon.save();
        
        return res.status(201).json({
            message: "Tạo mã giảm giá thành công",
            coupon: newCoupon
        });
    } catch (error) {
        console.error("Failed to create coupon", error);
        res.status(500).send({ 
            message: "Failed to create coupon",
            error: error.message 
        });
    }
});

// Update coupon (Admin)
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Validate discount value
        if (updateData.discountType === 'percentage' && updateData.discountValue > 100) {
            return res.status(400).json({ message: "Phần trăm giảm giá không được vượt quá 100%" });
        }
        
        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        return res.status(200).json({
            message: "Cập nhật mã giảm giá thành công",
            coupon
        });
    } catch (error) {
        console.error("Failed to update coupon", error);
        res.status(500).send({ message: "Failed to update coupon" });
    }
});

// Delete coupon (Admin)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        return res.status(200).json({
            message: "Xóa mã giảm giá thành công"
        });
    } catch (error) {
        console.error("Failed to delete coupon", error);
        res.status(500).send({ message: "Failed to delete coupon" });
    }
});

// Toggle coupon active status (Admin)
router.patch("/:id/toggle", async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        
        return res.status(200).json({
            message: `Mã giảm giá đã được ${coupon.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
            coupon
        });
    } catch (error) {
        console.error("Failed to toggle coupon status", error);
        res.status(500).send({ message: "Failed to toggle coupon status" });
    }
});

// Apply coupon to order (for calculation)
router.post("/apply", async (req, res) => {
    try {
        const { code, orderTotal, userId } = req.body;
        const upperCode = code.toUpperCase();
        
        // First check if it's a rank coupon
        const rankCoupon = await Rank.findOne({ couponCode: upperCode });
        
        if (rankCoupon) {
            // This is a rank coupon - handle separately
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "Bạn cần đăng nhập để sử dụng mã giảm giá hạng thành viên!"
                });
            }
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy tài khoản!"
                });
            }
            
            // Check if user has already used this rank coupon
            if (user.usedRankCoupons && user.usedRankCoupons.includes(upperCode)) {
                return res.status(400).json({
                    success: false,
                    message: "Bạn đã sử dụng mã giảm giá của hạng này rồi!"
                });
            }
            
            // Check if user has enough points for this rank
            if (user.rewardPoints < rankCoupon.minPoints) {
                return res.status(400).json({
                    success: false,
                    message: `Bạn cần ít nhất ${rankCoupon.minPoints} điểm để sử dụng mã này!`
                });
            }
            
            // Check if user is within rank points range
            if (rankCoupon.maxPoints && user.rewardPoints > rankCoupon.maxPoints) {
                return res.status(400).json({
                    success: false,
                    message: "Bạn đã vượt qua hạng này, vui lòng sử dụng mã của hạng cao hơn!"
                });
            }
            
            // Calculate discount from rank COUPON (not the automatic rank discount)
            let discount = 0;
            let discountDescription = '';

            const discountType = rankCoupon.couponDiscountType || 'percent';

            if (discountType === 'percent' && rankCoupon.couponDiscountPercent > 0) {
                discount = Math.round(orderTotal * (rankCoupon.couponDiscountPercent / 100));
                discountDescription = `${rankCoupon.couponDiscountPercent}%`;
            } else if (discountType === 'amount' && rankCoupon.couponDiscountAmount > 0) {
                discount = rankCoupon.couponDiscountAmount;
                discountDescription = `${rankCoupon.couponDiscountAmount.toLocaleString('vi-VN')}đ`;
            }
            
            // Ensure discount doesn't exceed order total
            discount = Math.min(discount, orderTotal);
            
            return res.status(200).json({
                success: true,
                message: `Áp dụng mã giảm giá hạng ${rankCoupon.displayName} thành công!`,
                discount,
                finalTotal: orderTotal - discount,
                coupon: {
                    code: upperCode,
                    description: `Giảm ${discountDescription} - Hạng ${rankCoupon.displayName}`,
                    isRankCoupon: true
                }
            });
        }
        
        // If not a rank coupon, handle as regular coupon
        const coupon = await Coupon.findOne({ code: upperCode });
        
        if (!coupon) {
            return res.status(404).json({ 
                success: false,
                message: "Mã giảm giá không tồn tại!" 
            });
        }
        
        if (!coupon.isValid()) {
            return res.status(400).json({ 
                success: false,
                message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" 
            });
        }
        
        if (orderTotal < coupon.minPurchase) {
            return res.status(400).json({ 
                success: false,
                message: `Đơn hàng tối thiểu phải từ ${coupon.minPurchase.toLocaleString('vi-VN')}đ` 
            });
        }
        
        const discount = coupon.calculateDiscount(orderTotal);
        
        return res.status(200).json({
            success: true,
            message: "Áp dụng mã giảm giá thành công!",
            discount,
            finalTotal: orderTotal - discount,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                isRankCoupon: false
            }
        });
    } catch (error) {
        console.error("Failed to apply coupon", error);
        res.status(500).send({ message: "Failed to apply coupon" });
    }
});

module.exports = router;
