const express = require('express');
const router = express.Router();
const { createEvent, closeEvent, fetchLiveData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/events', protect, admin, createEvent);
router.put('/events/:id', protect, admin, closeEvent);
router.post('/fetch-live-data', protect, admin, fetchLiveData);

module.exports = router;
