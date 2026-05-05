const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  closeEvent, 
  syncPolymarketData, 
  seedMockActivity,
  adminGetAllEvents,
  adminGetEventById,
  adminUpdateEvent,
  adminDeleteEvent,
  adminGetAllVotes,
  adminDeleteVote,
  adminGetAllUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Event CRUD routes
router.post('/events', protect, admin, createEvent);
router.put('/events/:id/close', protect, admin, closeEvent);
router.get('/events', protect, admin, adminGetAllEvents);
router.get('/events/:id', protect, admin, adminGetEventById);
router.put('/events/:id', protect, admin, adminUpdateEvent);
router.delete('/events/:id', protect, admin, adminDeleteEvent);

// Sync and seed routes
router.post('/sync-polymarket', protect, admin, syncPolymarketData);
router.post('/seed-activity', protect, admin, seedMockActivity);

// Vote routes
router.get('/votes', protect, admin, adminGetAllVotes);
router.delete('/votes/:id', protect, admin, adminDeleteVote);

// User routes
router.get('/users', protect, admin, adminGetAllUsers);
router.get('/users/:id', protect, admin, adminGetUserById);
router.put('/users/:id', protect, admin, adminUpdateUser);
router.delete('/users/:id', protect, admin, adminDeleteUser);

module.exports = router;
