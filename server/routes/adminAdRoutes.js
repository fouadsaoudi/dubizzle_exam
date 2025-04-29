const express = require('express');
const router = express.Router();
const adminAdController = require('../controllers/adminAdController');
const { validateAdStatusUpdate } = require('../validators/adValidators');

router.get('/admin-get-all-ads', [], adminAdController.getAdminAds);
router.put('/update-ad-status/:id', validateAdStatusUpdate, adminAdController.updateAdStatus);

module.exports = router;
