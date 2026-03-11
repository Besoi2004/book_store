const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const User = require('../users/user.model');

router.get("/", async (req, res) => {
    try {
        const [
            totalOrders,
            totalSalesAgg,
            totalBooks,
            totalUsers,
            ordersByStatus,
            monthlySales,
            recentOrders,
            topSellingBooks,
            userTierStats,
            paymentMethodStats,
            lowStockBooks,
            outOfStockCount,
        ] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }]),
            Book.countDocuments(),
            User.countDocuments({ role: 'user' }),
            Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Order.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        totalSales: { $sum: "$totalPrice" },
                        totalOrders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(8)
                .select('name email totalPrice status createdAt paymentMethod'),
            Order.aggregate([
                { $match: { "products.0": { $exists: true } } },
                { $unwind: "$products" },
                {
                    $group: {
                        _id: "$products.productId",
                        title: { $first: "$products.title" },
                        totalSold: { $sum: "$products.quantity" },
                        revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ]),
            User.aggregate([
                { $match: { role: 'user' } },
                { $group: { _id: "$tier", count: { $sum: 1 } } }
            ]),
            Order.aggregate([
                { $group: { _id: "$paymentMethod", count: { $sum: 1 }, total: { $sum: "$totalPrice" } } }
            ]),
            Book.find({ stock: { $gt: 0, $lt: 10 } })
                .select('title stock')
                .sort({ stock: 1 })
                .limit(5),
            Book.countDocuments({ stock: 0 }),
        ]);

        res.status(200).json({
            totalOrders,
            totalSales: totalSalesAgg[0]?.totalSales || 0,
            totalBooks,
            totalUsers,
            ordersByStatus,
            monthlySales,
            recentOrders,
            topSellingBooks,
            userTierStats,
            paymentMethodStats,
            lowStockBooks,
            outOfStockCount,
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

module.exports = router;