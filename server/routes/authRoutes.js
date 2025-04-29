const express = require('express');
const router = express.Router();

const { registerValidation, loginValidation, getUserInfoValidation } = require('../validators/authValidators');
const authController = require('../controllers/authController');

// getCurrentUser
router.post('/me', getUserInfoValidation, authController.getCurrentUser);

// Register Route
router.post('/register', registerValidation, authController.register);

// Login Route
router.post('/login', loginValidation, authController.login);

module.exports = router;
