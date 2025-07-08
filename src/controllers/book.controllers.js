import { bookData } from "../config/models/book.model.js";

export const addBook = async (req, res) => {
    const { bookName, auther, genre, publisher, price, stock } = req.body;
    try {
        const newbook = new bookData({ bookName, auther, genre, publisher, price, stock});
        await newbook.save()
            .then(() => {
                res.status(201).json({ success: true, data: newbook });
            });
    } catch (error) {
        console.log('Error While SignUp, ', error);
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

export const getAllBooks = async(req, res) => {
    try {
        let { page, pagesize } = req.query;
        // If "page" and "pageSize" are not sent, we will default them to 1 and 50.
        page = parseInt(page) || 1;
        pagesize = parseInt(pagesize) || 10;

        const books = await bookData.find().limit(pagesize).skip((page - 1)* pagesize);
        const totalBooks = await bookData.countDocuments();

        res.status(200).json({ success: true, total_books:totalBooks, books: books, page, pagesize });
    } catch (error) {
        console.log('Error fetching all the books!', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteBook = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await bookData.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, message: 'Book deleted successfully', data: deletedBook });
    } catch (error) {
        console.log('Error deleting the book!', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateBook = async(req, res) => {
    const user = req.user;
    const { id, bookName, auther, genre, publisher, price, stock } = req.body;
    try {
        if(user.role === 'librarian'){
            const book = await bookData.findById(id);
            const updatedBook = await bookData.findByIdAndUpdate(
                id,
                { 
                    bookName: bookName || book.bookName, 
                    auther: auther || book.auther, 
                    genre: genre || book.genre, 
                    publisher: publisher || book.publisher, 
                    price: price || book.price, 
                    stock: stock || book.stock
                },
                { new: true }
            );
            if (!updatedBook) {
                return res.status(404).json({ success: false, message: 'Book not found' });
            }
            res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
        } else {
            return res.status(404).json({ success: false, message: 'Unauthorised' });
        }
    } catch (error) {
        console.log('Error updating the book!', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getBookGenreInfo = async(req, res) => {
    try {
        const totalGenres = await bookData.aggregate([
            { $sort: { genre: 1 } },
            { $group: { 
              _id: "$genre",
              books: { $sum: 1 }
            }}
          ]);
          res.status(200).json({ success: true, total_genre:totalGenres.length, genre:totalGenres });
    } catch (error) {
        console.log('Error fetching all the books!', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}   