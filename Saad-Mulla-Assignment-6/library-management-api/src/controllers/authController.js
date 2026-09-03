const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await userModel.findByEmail(email)) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'librarian' ? 'librarian' : 'student';
    const newUser = await userModel.create({ name, email, password: hashedPassword, role: userRole });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.userId });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { id: user.userId, name: user.name, role: user.role } });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    res.json(user);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await userModel.update(req.user.id, { name });
    delete updated.password;
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
};