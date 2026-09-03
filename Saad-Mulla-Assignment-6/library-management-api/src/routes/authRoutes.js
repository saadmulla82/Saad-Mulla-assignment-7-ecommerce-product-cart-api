/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], validate, authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
module.exports = router;