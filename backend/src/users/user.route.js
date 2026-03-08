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

module.exports = router;