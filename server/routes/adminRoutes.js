const express = require('express');
const router = express.Router();
const { createEvent, closeEvent, syncPolymarketData, seedMockActivity } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/events', protect, admin, createEvent);
router.put('/events/:id', protect, admin, closeEvent);
router.post('/sync-polymarket', protect, admin, syncPolymarketData);
router.post('/seed-activity', protect, admin, seedMockActivity);

module.exports = router;
