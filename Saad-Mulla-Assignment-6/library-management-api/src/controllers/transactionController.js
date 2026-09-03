const transModel = require('../models/transactionModel');
const bookModel = require('../models/bookModel');

exports.borrowBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.quantity < 1 || book.status === 'borrowed') return res.status(400).json({ error: 'Book not available' });

    const activeTrans = await transModel.findActiveByBookAndUser(req.params.id, req.user.id);
    if (activeTrans) return res.status(400).json({ error: 'You already borrowed this book' });

    await bookModel.update(req.params.id, { quantity: book.quantity - 1, status: book.quantity - 1 === 0 ? 'borrowed' : 'available' });
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrow period

    const trans = await transModel.create({
      userId: req.user.id,
      bookId: req.params.id,
      type: 'borrow',
      borrowDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'active'
    });
    res.status(201).json({ message: 'Book borrowed successfully', transaction: trans });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.returnBook = async (req, res) => {
  try {
    const activeTrans = await transModel.findActiveByBookAndUser(req.params.id, req.user.id);
    if (!activeTrans) return res.status(400).json({ error: 'No active borrow record found for this book' });

    const book = await bookModel.findById(req.params.id);
    await bookModel.update(req.params.id, { quantity: book.quantity + 1, status: 'available' });

    await transModel.update(activeTrans.transactionId, { type: 'return', returnDate: new Date().toISOString(), status: 'returned' });
    res.json({ message: 'Book returned successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getMyTransactions = async (req, res) => {
  try { res.json(await transModel.findByUser(req.user.id)); } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getAllTransactions = async (req, res) => {
  try { res.json(await transModel.findAll()); } catch (error) { res.status(500).json({ error: error.message }); }
};