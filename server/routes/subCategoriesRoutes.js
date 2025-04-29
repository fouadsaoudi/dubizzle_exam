const express = require('express');
const router = express.Router();

const subcategoriesController = require('../controllers/subcategoriesController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch all ads
router.get('/sub-categories', authMiddleware, subcategoriesController.getSubCategories);

module.exports = router;
