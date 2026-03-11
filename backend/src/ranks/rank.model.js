const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    minPoints: {
        type: Number,
        required: true,
        default: 0
    },
    maxPoints: {
        type: Number,
        default: null // null means unlimited for highest tier
    },
    discountPercent: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    couponCode: {
        type: String,
        default: ''
    },
    couponDiscountType: {
        type: String,
        enum: ['percent', 'amount'],
        default: 'percent'
    },
    couponDiscountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    couponDiscountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    benefits: [{
        type: String
    }],
    color: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
rankSchema.index({ minPoints: 1 });
rankSchema.index({ order: 1 });

const Rank = mongoose.model('Rank', rankSchema);

module.exports = Rank;
