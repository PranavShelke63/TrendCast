const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserActivity } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id/activity').get(protect, getUserActivity);

module.exports = router;
