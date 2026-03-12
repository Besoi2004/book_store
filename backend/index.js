const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000
require('dotenv').config();

// ── MongoDB connection caching (required for Vercel serverless) ──────────────
let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        if (!process.env.DB_URL) throw new Error('DB_URL environment variable is not set!');
        cached.promise = mongoose.connect(process.env.DB_URL, {
            autoIndex: false,
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
// ─────────────────────────────────────────────────────────────────────────────

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
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection error:', err.message);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

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

app.get('/', (req, res) => {
    res.send('Hello - Backend is running!')
});

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/ranks", rankRoutes);

// Initialize ranks once on first connection
connectDB()
    .then(() => autoInitializeRanks())
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
}

module.exports = app;
