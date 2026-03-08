const mongoose = require('mongoose');
const User = require('./src/users/user.model');
require('dotenv').config();

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        // Delete existing admin
        await User.deleteMany({ username: 'admin' });
        console.log('Deleted existing admin user(s)');

        // Create new admin with proper data
        const admin = new User({
            username: 'admin',
            email: 'admin@bookstore.com',
            password: 'admin123',  // Will be hashed automatically
            role: 'admin'
        });

        await admin.save();
        console.log('\n✅ Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Email: admin@bookstore.com');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetAdmin();
