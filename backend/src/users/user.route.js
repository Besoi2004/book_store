const express = require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    try {
        const admin =  await User.findOne({username});
        if(!admin) {
            return res.status(404).send({message: "Admin not found!"})
        }
        
        // Use bcrypt to compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(!isPasswordValid) {
            return res.status(401).send({message: "Invalid password!"})
        }
        
        const token =  jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to login as admin", error)
       res.status(401).send({message: "Failed to login as admin"}) 
    }
})

// Route to create admin user (for initial setup - remove in production)
router.post("/create-admin", async (req, res) => {
    const {username, email, password} = req.body;
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({username});
        if(existingAdmin) {
            return res.status(400).send({message: "Admin already exists!"})
        }
        
        // Create new admin
        const newAdmin = new User({
            username,
            email,
            password,  // Password will be hashed by pre-save middleware
            role: 'admin'
        });
        
        await newAdmin.save();
        
        return res.status(201).json({
            message: "Admin created successfully",
            user: {
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role
            }
        })
        
    } catch (error) {
       console.error("Failed to create admin", error)
       res.status(500).send({message: "Failed to create admin"}) 
    }
})

// Helper function to calculate tier based on rewardPoints
const calculateTier = (rewardPoints) => {
    if (rewardPoints >= 5000) return 'diamond';
    if (rewardPoints >= 2000) return 'gold';
    if (rewardPoints >= 500) return 'silver';
    return 'bronze';
};

// Get all users (Admin only)
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Failed to get users", error);
        res.status(500).send({ message: "Failed to get users" });
    }
});

// Get user profile by email
router.get("/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Failed to get user profile", error);
        res.status(500).send({ message: "Failed to get user profile" });
    }
});

// Update user profile (or create if doesn't exist)
router.put("/:email", async (req, res) => {
    const { email } = req.params;
    const { username, phone, address, ward, district, city, country, avatar } = req.body;
    
    try {
        let user = await User.findOne({ email });
        
        // If user doesn't exist, create new one (for users from Firebase)
        if (!user) {
            user = new User({
                username: username || 'User',
                email: email,
                password: Math.random().toString(36).slice(-8), // Random password for Firebase users
                role: 'user',
                avatar: avatar || '',
                rewardPoints: 0,
                tier: 'bronze',
                phone: phone || '',
                address: address || '',
                ward: ward || '',
                district: district || '',
                city: city || '',
                country: country || 'Việt Nam'
            });
        } else {
            // Update fields if provided
            if (username) user.username = username;
            if (phone !== undefined) user.phone = phone;
            if (address !== undefined) user.address = address;
            if (ward !== undefined) user.ward = ward;
            if (district !== undefined) user.district = district;
            if (city !== undefined) user.city = city;
            if (country !== undefined) user.country = country;
            if (avatar !== undefined) user.avatar = avatar;
        }
        
        await user.save();
        
        // Return user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;
        
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Failed to update user profile", error);
        console.error("Error details:", error.message);
        res.status(500).send({ 
            message: "Failed to update user profile",
            error: error.message 
        });
    }
});

// Add rewardPoints to user (called after order completion)
router.put("/:email/rewardPoints", async (req, res) => {
    const { email } = req.params;
    const { rewardPoints: pointsToAdd } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        const oldPoints = user.rewardPoints;
        const oldTier = user.tier;
        
        // Add rewardPoints
        user.rewardPoints += pointsToAdd;
        
        // Calculate and update tier
        const newTier = calculateTier(user.rewardPoints);
        user.tier = newTier;
        
        await user.save();
        
        // Check if tier upgraded
        const tierUpgraded = oldTier !== newTier;
        
        return res.status(200).json({
            message: "RewardPoints added successfully",
            rewardPoints: user.rewardPoints,
            tier: user.tier,
            tierUpgraded,
            previousTier: oldTier,
            pointsAdded: pointsToAdd
        });
    } catch (error) {
        console.error("Failed to add rewardPoints", error);
        res.status(500).send({ message: "Failed to add rewardPoints" });
    }
});

// Get user's favorite books
router.get("/:email/favorites", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email }).populate('favoriteBooks');
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        return res.status(200).json({ favoriteBooks: user.favoriteBooks || [] });
    } catch (error) {
        console.error("Failed to get favorite books", error);
        res.status(500).send({ message: "Failed to get favorite books" });
    }
});

// Toggle favorite book
router.post("/:email/favorites/:bookId", async (req, res) => {
    const { email, bookId } = req.params;
    const Book = require('../books/book.model');
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: "Book not found!" });
        }
        
        // Check if book is already in favorites
        const bookIndex = user.favoriteBooks.indexOf(bookId);
        let isFavorited;
        
        if (bookIndex > -1) {
            // Remove from favorites
            user.favoriteBooks.splice(bookIndex, 1);
            book.favorites = Math.max((book.favorites || 0) - 1, 0);
            isFavorited = false;
        } else {
            // Add to favorites
            user.favoriteBooks.push(bookId);
            book.favorites = (book.favorites || 0) + 1;
            isFavorited = true;
        }
        
        await user.save();
        await book.save();
        
        return res.status(200).json({
            message: isFavorited ? "Added to favorites" : "Removed from favorites",
            isFavorited,
            favoriteBooks: user.favoriteBooks,
            bookFavorites: book.favorites
        });
    } catch (error) {
        console.error("Failed to toggle favorite", error);
        res.status(500).send({ message: "Failed to toggle favorite" });
    }
});

// Update user role (Admin only)
router.put("/:id/role", async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    
    try {
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).send({ message: "Invalid role! Must be 'user' or 'admin'" });
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        user.role = role;
        await user.save();
        
        return res.status(200).json({
            message: "User role updated successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Failed to update user role", error);
        res.status(500).send({ message: "Failed to update user role" });
    }
});

// Delete user (Admin only)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).send({ message: "Cannot delete admin users!" });
        }
        
        await User.findByIdAndDelete(id);
        
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete user", error);
        res.status(500).send({ message: "Failed to delete user" });
    }
});

// Reveal rank coupon code (when user clicks gift box)
router.post("/:email/reveal-rank-coupon", async (req, res) => {
    const { email } = req.params;
    const { rankId } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        
        // Get the rank details
        const Rank = require('../ranks/rank.model');
        const rank = await Rank.findById(rankId);
        if (!rank) {
            return res.status(404).send({ message: "Rank not found!" });
        }
        
        // Check if user has enough points for this rank
        if (user.rewardPoints < rank.minPoints) {
            return res.status(403).send({ 
                message: "You haven't reached this rank yet!",
                requiredPoints: rank.minPoints,
                currentPoints: user.rewardPoints
            });
        }
        
        // Check if coupon is already revealed
        if (user.revealedRankCoupons && user.revealedRankCoupons.includes(rank.couponCode)) {
            return res.status(200).json({
                message: "Coupon already revealed",
                couponCode: rank.couponCode,
                alreadyRevealed: true
            });
        }
        
        // Add coupon to revealed list
        if (!user.revealedRankCoupons) {
            user.revealedRankCoupons = [];
        }
        user.revealedRankCoupons.push(rank.couponCode);
        await user.save();
        
        return res.status(200).json({
            message: "Coupon revealed successfully!",
            couponCode: rank.couponCode,
            alreadyRevealed: false
        });
    } catch (error) {
        console.error("Failed to reveal rank coupon", error);
        res.status(500).send({ message: "Failed to reveal rank coupon" });
    }
});

module.exports = router;