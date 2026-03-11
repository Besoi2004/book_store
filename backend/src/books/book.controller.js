const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        // Kiểm tra giá bán không được cao hơn giá cũ
        if (req.body.newPrice > req.body.oldPrice) {
            return res.status(400).send({message: "Giá bán không được cao hơn giá cũ!"});
        }
        
        const newBook = new Book({...req.body});
        await newBook.save();
        res.status(200).send({message: "Book posted successfully", book: newBook});
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).send({message: "Failed to create book"});
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1});
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send({message: "Failed to fetch books"});
    }
};

const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).send({message: "Book not found"});
        }
        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send({message: "Failed to fetch book"});
    }
};

const updateBook = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Kiểm tra giá bán không được cao hơn giá cũ
        if (req.body.newPrice && req.body.oldPrice && req.body.newPrice > req.body.oldPrice) {
            return res.status(400).send({message: "Giá bán không được cao hơn giá cũ!"});
        }
        
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook){
            return res.status(404).send({message: "Book not found"});
        }
        res.status(200).send({message: "Book updated successfully", book: updatedBook});
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send({message: "Failed to update book"});
    }
};

const deleteBook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if(!deletedBook){
            return res.status(404).send({message: "Book not found"});
        }
        res.status(200).send({message: "Book deleted successfully", book: deletedBook});
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send({message: "Failed to delete book"});
    }
};

const toggleFavorite = async (req, res) => {
    try {
        const {id} = req.params;
        const {increment} = req.body; // true to add favorite, false to remove
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).send({message: "Book not found"});
        }
        
        // Increment or decrement favorites count
        if(increment) {
            book.favorites = (book.favorites || 0) + 1;
        } else {
            book.favorites = Math.max((book.favorites || 0) - 1, 0);
        }
        
        await book.save();
        res.status(200).send({message: "Favorites updated successfully", book: book});
    } catch (error) {
        console.error("Error updating favorites:", error);
        res.status(500).send({message: "Failed to update favorites"});
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    toggleFavorite
};