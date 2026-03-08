const express = require('express')
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000
require('dotenv').config();

//middleware
app.use(express.json());

// CORS configuration for production and development
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
  process.env.FRONTEND_URL // Add your Vercel frontend URL here
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
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

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
    res.send('Hello ')
    })
}

main().then(() => console.log('Connected to MongoDB successfully')).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
