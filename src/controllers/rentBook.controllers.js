import { userData } from "../config/models/user.model.js";
import { bookData } from "../config/models/book.model.js";
import { rentedBookData } from "../config/models/rentedBook.model.js"


export const rentedBook = async (req, res) => {
    try {
        const { userId, booksData, days } = req.body;
        const results = [];

        for (const { bookId, quantity } of booksData) {
            const user = await userData.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const book = await bookData.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            if (book.stock === 0) {
                return res.status(400).json({ message: "Book is out of stock" });
            }
            if (quantity > book.stock) {
                return res.status(400).json({ message: "Quantity exceeds the stock" });
            }
            const rentedBook = await rentedBookData.create({
                issuedBook: bookId,
                issuedToUser: userId,
                stock: quantity,
                rentDays: days
            });
            results.push(rentedBook);

            book.stock -= quantity;
            await book.save();
        }

        res.status(200).json({ message: "Books issued successfully", rents: results });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rentedBooksByUserAndRemainingDays = async (req, res) => {
    try {
        const { userId } = req.params;
        const rentedBooks = await rentedBookData.find({ issuedToUser: userId });
        if (rentedBooks.length === 0) {
            return res.status(404).json({ message: "No rented books found" });
        }
        const today = new Date();
        const results = [];

        for (const rentedBook of rentedBooks) {
            const createdAt = rentedBook.createdAt;
            const diffTime = Math.abs(today - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const remainingDays = rentedBook.rentDays - diffDays;
            if (remainingDays <= 0) {
                rentedBook.fine = calculateFine(remainingDays);
            }
            results.push({ rentedBook, remainingDays });
        }
        

        res.status(200).json({ message: "Rented books found", totalRentedBooks: results.length, rentedBooks: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const calculateFine = (remainingDays) => {
    return remainingDays * 10;
}

export const rentBookReturnByUser = async (req, res) => {
    try {
        const { userId, booksData } = req.body;
        const results = [];

        for (const { bookId, quantity } of booksData) {
            const user = await userData.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const book = await bookData.findById(bookId);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            const rentedBook = await rentedBookData.findOne({ issuedBook: bookId, issuedToUser: userId });
            if (!rentedBook) {
                return res.status(404).json({ message: "Book not found in rented books" });
            }
            if (quantity > rentedBook.stock) {
                return res.status(400).json({ message: "Quantity exceeds the rented stock" });
            }
            results.push(rentedBook);

            book.stock += quantity;
            await book.save();
            await rentedBookData.deleteOne({ _id: rentedBook._id });
        }

        res.status(200).json({ message: "Books returned successfully", returns: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const rentedBooksInfo = async (req, res) => {
    try {
        const rentedBooks = await rentedBookData.find();
        if (rentedBooks.length === 0) {
            return res.status(404).json({ message: "No rented books found" });
        }
        const today = new Date();
        const results = [];

        for (const rentedBook of rentedBooks) {
            const createdAt = rentedBook.createdAt;
            const diffTime = Math.abs(today - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const remainingDays = rentedBook.rentDays - diffDays;
            if (remainingDays <= 0) {
                rentedBook.fine = calculateFine(remainingDays);
            }
            const user = await userData.findById(rentedBook.issuedToUser);
            results.push({ rentedBook, remainingDays, user });
        }

        res.status(200).json({ message: "Rented books found", totalRentedBooks: results.length, rentedBooks: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}