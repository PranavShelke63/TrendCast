const Event = require('../models/Event');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// @desc    Get all active events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event with vote stats
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Get vote counts
      const votes = await Vote.aggregate([
        { $match: { event: new mongoose.Types.ObjectId(req.params.id) } },
        { $group: { _id: '$optionId', count: { $sum: 1 } } }
      ]);
      
      const totalVotes = await Vote.countDocuments({ event: req.params.id });

      res.json({ event, votes, totalVotes });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a vote
// @route   POST /api/events/:id/vote
// @access  Private
const voteEvent = async (req, res) => {
  const { optionId } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isActive) {
      return res.status(400).json({ message: 'Event is closed for voting' });
    }

    // Check if user already voted
    const alreadyVoted = await Vote.findOne({
      user: req.user._id,
      event: event._id
    });

    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted on this event' });
    }

    const vote = await Vote.create({
      user: req.user._id,
      event: event._id,
      optionId
    });

    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  voteEvent
};
