const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  options: {
    type: [optionSchema],
    validate: [v => v.length >= 2, 'An event must have at least 2 options']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  outcome: {
    type: String,
    default: null // The id of the winning option
  },
  closedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
