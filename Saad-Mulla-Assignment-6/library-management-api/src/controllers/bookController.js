const bookModel = require('../models/bookModel');

exports.getAllBooks = async (req, res) => {
  try { res.json(await bookModel.findAll()); } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getBookById = async (req, res) => {
  try { 
    const book = await bookModel.findById(req.params.id);
    book ? res.json(book) : res.status(404).json({ error: 'Book not found' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.addBook = async (req, res) => {
  try { res.status(201).json(await bookModel.create(req.body)); } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateBook = async (req, res) => {
  try { res.json(await bookModel.update(req.params.id, req.body)); } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteBook = async (req, res) => {
  try { await bookModel.delete(req.params.id); res.json({ message: 'Book deleted' }); } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.searchBooks = async (req, res) => {
  try { res.json(await bookModel.search(req.query.q || '')); } catch (error) { res.status(500).json({ error: error.message }); }
};