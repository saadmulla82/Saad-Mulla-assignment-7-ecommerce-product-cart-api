const { db } = require('../config/firebase');
const transCollection = db.collection('transactions');
module.exports = {
  async create(data) {
    const docRef = transCollection.doc();
    await docRef.set({ ...data, transactionId: docRef.id, createdAt: new Date().toISOString() });
    return (await docRef.get()).data();
  },
  async findByUser(userId) {
    const snapshot = await transCollection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data());
  },
  async findAll() {
    const snapshot = await transCollection.get();
    return snapshot.docs.map(doc => doc.data());
  },
  async findActiveByBookAndUser(bookId, userId) {
    const snapshot = await transCollection.where('bookId', '==', bookId).where('userId', '==', userId).where('status', '==', 'active').limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  },
  async update(id, data) {
    await transCollection.doc(id).update(data);
  }
};