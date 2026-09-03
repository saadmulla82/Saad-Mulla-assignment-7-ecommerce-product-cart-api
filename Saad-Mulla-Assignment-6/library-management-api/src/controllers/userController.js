const userModel = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try { 
    const users = await userModel.findAll();
    users.forEach(u => delete u.password);
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    res.json(user);
  } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateUserRole = async (req, res) => {
  try { res.json(await userModel.update(req.params.id, { role: req.body.role })); } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteUser = async (req, res) => {
  try { await userModel.delete(req.params.id); res.json({ message: 'User deleted' }); } catch (error) { res.status(500).json({ error: error.message }); }
};