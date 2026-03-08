const mongoose = require('mongoose');
const User = require('./src/users/user.model');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists!');
            console.log('Username:', existingAdmin.username);
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create new admin
        const admin = new User({
            username: 'admin',
            email: 'admin@bookstore.com',
            password: 'admin123',  // Will be hashed automatically by pre-save middleware
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Email: admin@bookstore.com');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
