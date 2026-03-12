const express = require('express');
const Book = require('./book.model');
const Order = require('../orders/order.model');
const { postABook, getAllBooks, getSingleBook, updateBook, deleteBook, toggleFavorite } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();


// post a book
router.post("/create-book", verifyAdminToken, postABook); 

// get all books
router.get("/", getAllBooks);

// sold stats — aggregate sold quantity per book from delivered orders
router.get("/sold-stats", verifyAdminToken, async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { status: 'delivered', 'products.0': { $exists: true } } },
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.productId',
                    soldCount: { $sum: '$products.quantity' }
                }
            }
        ]);
        // Convert to a map { bookId: soldCount }
        const map = {};
        stats.forEach(s => { map[s._id.toString()] = s.soldCount; });
        res.status(200).json(map);
    } catch (error) {
        console.error('Failed to get sold stats', error);
        res.status(500).json({ message: 'Failed to get sold stats' });
    }
});

// single book endpoint
router.get("/:id", getSingleBook);

// update book
router.put("/edit/:id", verifyAdminToken, updateBook);

// delete book
router.delete("/:id", verifyAdminToken, deleteBook);

// toggle favorite
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;
