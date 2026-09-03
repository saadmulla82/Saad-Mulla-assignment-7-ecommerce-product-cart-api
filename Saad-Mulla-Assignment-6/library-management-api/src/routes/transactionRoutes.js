const express = require('express');
const router = express.Router();
const transController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

// Student routes
router.post('/books/:id/borrow', auth, checkRole(['student']), transController.borrowBook);
router.post('/books/:id/return', auth, checkRole(['student']), transController.returnBook);
router.get('/my', auth, transController.getMyTransactions);

// Librarian routes
router.get('/', auth, checkRole(['librarian']), transController.getAllTransactions);
module.exports = router;