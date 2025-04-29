const express = require('express');
const router = express.Router();

const adController = require('../controllers/adController');
const { adsListValidation, adIdValidation, createAdValidation } = require('../validators/adValidators');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch all ads
router.get('/ads', adsListValidation, adController.getAllAds);
// Create ads
router.post('/ads', [authMiddleware, createAdValidation], adController.createAd);
// Fetch my ads
router.get('/my-ads', authMiddleware, adController.getMyAds);
// Fetch single ad by ID
router.get('/ads/:id', adIdValidation, adController.getAdById);
// Update ad by ID
router.put('/ads/:id', [adIdValidation, createAdValidation], adController.updateAdById);

module.exports = router;
