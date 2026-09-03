const { db } = require('../config/firebase');
const usersCollection = db.collection('users');
module.exports = {
  async create(userData) {
    const docRef = usersCollection.doc();
    await docRef.set({ ...userData, userId: docRef.id, createdAt: new Date().toISOString() });
    return (await docRef.get()).data();
  },
  async findByEmail(email) {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  },
  async findById(id) {
    const doc = await usersCollection.doc(id).get();
    return doc.exists ? doc.data() : null;
  },
  async update(id, data) {
    await usersCollection.doc(id).update({ ...data, updatedAt: new Date().toISOString() });
    return this.findById(id);
  },
  async findAll() {
    const snapshot = await usersCollection.get();
    return snapshot.docs.map(doc => doc.data());
  },
  async delete(id) {
    await usersCollection.doc(id).delete();
  }
};