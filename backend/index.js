const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000
require('dotenv').config();

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration for production and development
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://tiemsachhuvostore.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

//router
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');
const notificationRoutes = require('./src/notifications/notification.route');
const couponRoutes = require('./src/coupons/coupon.route');
const contactRoutes = require('./src/contacts/contact.route');
const rankRoutes = require('./src/ranks/rank.route');
const { autoInitializeRanks } = require('./src/ranks/rank.init');

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/ranks", rankRoutes);

async function main() {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL environment variable is not set!');
    }
    // Connect to MongoDB with autoIndex disabled to prevent duplicate index warnings
    await mongoose.connect(process.env.DB_URL, {
        autoIndex: false // Disable automatic index creation on startup
    });
    
    // Auto-initialize default ranks if none exist
    await autoInitializeRanks();
    
    app.get('/', (req, res) => {
        res.send('Hello - Backend is running!')
    })
}

main()
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
