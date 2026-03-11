const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true 
    },
    discountType: { 
        type: String, 
        enum: ['fixed', 'percentage'], 
        required: true 
    },
    discountValue: { 
        type: Number, 
        required: true,
        min: 0
    },
    minPurchase: { 
        type: Number, 
        default: 0,
        min: 0
    },
    maxDiscount: { 
        type: Number, 
        default: null // Chỉ áp dụng cho percentage type
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    usageLimit: { 
        type: Number, 
        default: null // null = unlimited
    },
    usedCount: { 
        type: Number, 
        default: 0 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    applicableCategories: [{
        type: String
    }],
    createdBy: {
        type: String,
        default: 'admin'
    }
}, { timestamps: true });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate &&
           (this.usageLimit === null || this.usedCount < this.usageLimit);
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderTotal) {
    if (!this.isValid()) {
        return 0;
    }
    
    if (orderTotal < this.minPurchase) {
        return 0;
    }
    
    let discount = 0;
    if (this.discountType === 'fixed') {
        discount = this.discountValue;
    } else if (this.discountType === 'percentage') {
        discount = (orderTotal * this.discountValue) / 100;
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    }
    
    return Math.min(discount, orderTotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
