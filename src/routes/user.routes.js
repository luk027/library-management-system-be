import express from 'express'
import { signUp, login, logout, getAllUsers, getUserById,deleteUser, updateUser } from '../controllers/user.controllers.js';
import { authenticateUser, checkUserRole } from '../middleware/authmiddleware.js'
import { addBook, deleteBook, getAllBooks, updateBook, getBookGenreInfo } from '../controllers/book.controllers.js';
import {userValidation, bookValidation} from '../validations/index.js'
import { purchaseBook, totalSalesWithPrice } from '../controllers/purchasedBook.controllers.js';
import { rentBookReturnByUser, rentedBook, rentedBooksByUserAndRemainingDays, rentedBooksInfo } from '../controllers/rentBook.controllers.js';

const router = express.Router();


//----------------BOOKS INFORMATION-----------------
router.get('/getallbooks', getAllBooks);
router.get('/getgenreinfo', getBookGenreInfo);


//----------------USER'S SIGNUP & LOGIN-----------------
router.get('/getuser', getAllUsers);
router.get('/getuser/:id', getUserById);
router.post('/signup', userValidation.signup, signUp);
router.post('/login', userValidation.login, login);
router.post('/logout', logout);
router.delete('/deleteuser/:id', authenticateUser, checkUserRole(['customer']),deleteUser);
router.put('/updateuser/:id', userValidation.updateUser, authenticateUser, checkUserRole(['librarian', 'customer']),updateUser);


//----------------USER'S["Librarian"] CRUD BOOK-----------------
router.post('/addbook', bookValidation.addBook, authenticateUser, checkUserRole(['librarian']), addBook);
router.delete('/deletebook/:id', authenticateUser, checkUserRole(['librarian']), deleteBook);
router.put('/updatebook',  bookValidation.updateBook, authenticateUser, checkUserRole(['librarian']), updateBook);
router.get('/totalSaleasWithPrice', totalSalesWithPrice)
router.get('/rentedBooksByUserAndRemainingDays/:userId', rentedBooksByUserAndRemainingDays);
router.post('/rentBookReturnByUser', rentBookReturnByUser);
router.get('/rentedBooksInfo', rentedBooksInfo);


//----------------USER'S["Customers"] Purchase BOOKS-----------------
router.post('/purchasebook', authenticateUser, checkUserRole(['customer']), purchaseBook);
router.post('/issuedbooks', rentedBook); 


export const userRouter = router;