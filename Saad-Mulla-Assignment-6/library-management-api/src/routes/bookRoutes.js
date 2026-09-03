/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 */
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/search', bookController.searchBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Librarian only
router.post('/', auth, checkRole(['librarian']), bookController.addBook);
router.put('/:id', auth, checkRole(['librarian']), bookController.updateBook);
router.delete('/:id', auth, checkRole(['librarian']), bookController.deleteBook);
module.exports = router;