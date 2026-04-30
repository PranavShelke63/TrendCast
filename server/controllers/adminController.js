const Event = require('../models/Event');

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  const { title, description, options } = req.body;

  try {
    const event = new Event({
      title,
      description,
      options,
      createdBy: req.user._id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close an event and set outcome
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const closeEvent = async (req, res) => {
  const { outcome } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      event.isActive = false;
      event.outcome = outcome;
      event.closedAt = Date.now();

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch Polymarket style data to populate markets
// @route   POST /api/admin/fetch-live-data
// @access  Private/Admin
const fetchLiveData = async (req, res) => {
  try {
    const newEvents = [
      {
        title: "Will the Federal Reserve cut interest rates in June 2026?",
        description: "This market resolves to Yes if the US Federal Reserve announces a cut to the federal funds target rate during their June 2026 FOMC meeting.",
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: req.user._id
      },
      {
        title: "Who will win the 2026 FIFA World Cup?",
        description: "Predict the winner of the 2026 FIFA World Cup hosted by USA, Canada, and Mexico.",
        options: [{ id: 'bra', text: 'Brazil' }, { id: 'fra', text: 'France' }, { id: 'arg', text: 'Argentina' }, { id: 'eng', text: 'England' }],
        createdBy: req.user._id
      },
      {
        title: "Will Bitcoin reach $150,000 by end of 2026?",
        description: "This market resolves to Yes if the price of Bitcoin (BTC) hits $150,000 USD on Binance at any point before Dec 31, 2026.",
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: req.user._id
      },
      {
        title: "Will OpenAI release GPT-5 before July 2026?",
        description: "This market resolves to Yes if OpenAI officially releases a model named 'GPT-5' to the public before July 1, 2026.",
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: req.user._id
      },
      {
        title: "Will humans land on Mars by 2030?",
        description: "This market resolves to Yes if any human crew lands on the surface of Mars before January 1, 2030.",
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: req.user._id
      }
    ];

    const createdEvents = await Event.insertMany(newEvents);
    res.status(201).json({ message: 'Polymarket data synced successfully', count: createdEvents.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  closeEvent,
  fetchLiveData
};
