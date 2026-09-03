const { db } = require('../config/firebase');
const booksCollection = db.collection('books');
module.exports = {
  async create(data) {
    const docRef = booksCollection.doc();
    await docRef.set({ ...data, bookId: docRef.id, status: 'available', createdAt: new Date().toISOString() });
    return (await docRef.get()).data();
  },
  async findAll() {
    const snapshot = await booksCollection.get();
    return snapshot.docs.map(doc => doc.data());
  },
  async findById(id) {
    const doc = await booksCollection.doc(id).get();
    return doc.exists ? doc.data() : null;
  },
  async update(id, data) {
    await booksCollection.doc(id).update(data);
    return this.findById(id);
  },
  async delete(id) {
    await booksCollection.doc(id).delete();
  },
  async search(query) {
    // Basic search simulation
    const snapshot = await booksCollection.get();
    const allBooks = snapshot.docs.map(doc => doc.data());
    return allBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()));
  }
};