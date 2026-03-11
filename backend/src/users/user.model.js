const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    rewardPoints: { type: Number, default: 0 },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'diamond'], default: 'bronze' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    ward: { type: String, default: '' },
    district: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: 'Việt Nam' },
    favoriteBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    revealedRankCoupons: [{ type: String, default: [] }], // Mảng lưu các mã rank đã mở hộp quà
    usedRankCoupons: [{ type: String, default: [] }] // Mảng lưu các mã rank đã sử dụng
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});
const User = mongoose.model('User', userSchema);

module.exports = User;