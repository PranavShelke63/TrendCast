const express = require('express');
const router = express.Router();
const { getEvents, getEventById, voteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getEvents);
router.route('/:id').get(getEventById);
router.route('/:id/vote').post(protect, voteEvent);

module.exports = router;
