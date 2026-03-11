const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, updateBook, deleteBook, toggleFavorite } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();


// post a book
router.post("/create-book", verifyAdminToken, postABook); 

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update book
router.put("/edit/:id", verifyAdminToken, updateBook);

// delete book
router.delete("/:id", verifyAdminToken, deleteBook);

// toggle favorite
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;
