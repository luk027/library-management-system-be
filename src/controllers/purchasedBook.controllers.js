import { userData } from "../config/models/user.model.js";
import { bookData } from "../config/models/book.model.js";
import { purchasedBookData } from "../config/models/purchasedBook.model.js";

// payload = {
//     "userId": "67d9845a1a990054b7433333",
//     "booksData": [
//         {
//             "bookId": "67ec04acf4258e00115e1c56",
//             "quantity": "1"
//         },
//         {
//             "bookId": "67ec04bbf4258e00115e1c5a",
//             "quantity": "3"
//         }
//     ]
// }

export const purchaseBook = async (req, res) => {
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
            if (book.stock === 0) {
                return res.status(400).json({ message: "Book is out of stock" });
            }
            if (quantity > book.stock) {
                return res.status(400).json({ message: "Quantity exceeds the stock" });
            }
            const purchasedBook = await purchasedBookData.create({
                purchasedBook: bookId,
                purchasedByUser: userId,
                stock: quantity
            });
            results.push(purchasedBook);

            book.stock -= quantity;
            await book.save();
        }

        res.status(200).json({ message: "Books purchased successfully", purchases: results });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const totalSalesWithPrice = async (req, res) => {
    try {
        const totalSales = await purchasedBookData.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "purchasedBook",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $group: {
                    _id: "sales",
                    totalBook_Sales: { $sum: "$stock" },
                    totalPrice: { $sum: { $multiply: ["$stock", "$book.price"] } }
                }
            }
        ]);
        res.status(200).json(totalSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

