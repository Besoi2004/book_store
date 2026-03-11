const  mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { 
        city: { type: String, required: true },
        state: String,
        country: String,
        zipcode: String,
    },
    phone:{ type: String, required: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }],
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 30000 },
    rewardPointsEarned: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['cod', 'bank_transfer'], default: 'cod' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], default: 'pending' },
    discounts: {
        tierDiscount: { type: Number, default: 0 },
        couponDiscount: { type: Number, default: 0 },
        couponCode: { type: String, default: null }
    }
},{ timestamps: true 

});

const Order = mongoose.model('Order', orderSchema);

module.exports = mongoose.model('Order', orderSchema);