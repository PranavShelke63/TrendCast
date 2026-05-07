const Groq = require('groq-sdk');
const Event = require('../models/Event');

const User = require('../models/User');
const Vote = require('../models/Vote');


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

// Admin CRUD for Events

// @desc    Get all events (admin)
// @route   GET /api/admin/events
// @access  Private/Admin
const adminGetAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID (admin)
// @route   GET /api/admin/events/:id
// @access  Private/Admin
const adminGetEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event (admin)
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const adminUpdateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event (admin)
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const adminDeleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route   POST /api/admin/sync-polymarket
// @access  Private/Admin
const syncPolymarketData = async (req, res) => {
  try {
    // Fetch existing titles to prevent duplicates
    const existingEvents = await Event.find({}, { title: 1 });
    const existingTitles = existingEvents.map(e => e.title.toLowerCase().trim());

    const prompt = `You are a prediction market data generator for a platform similar to Polymarket, but for Indian and global audiences.

Generate exactly 12 unique prediction market events that are TRENDING RIGHT NOW in May 2026.

Categories to cover (2-3 events per category):
- Politics (Indian elections, US politics, geopolitics)
- Crypto & Finance (Bitcoin, Ethereum, stock markets, RBI, inflation)
- Technology (AI releases, tech company launches, space missions)
- Sports (Cricket IPL, FIFA, Olympics, tennis)
- Entertainment (Bollywood, Hollywood, music, awards)

Rules:
1. Each event must be a clear Yes/No question or have 2-4 specific outcome options
2. Events must be realistic and plausible for May 2026
3. Descriptions should be 1-2 sentences explaining resolution criteria
4. Make them feel like real Polymarket-style prediction markets
5. Include a mix of Indian-focused and global events
6. Do NOT generate any of these existing events: ${existingTitles.slice(0, 20).join(' | ')}

Respond ONLY with a valid JSON array. No markdown, no code blocks, no explanation. Just the raw JSON array.

Each object must have exactly these fields:
{
  "title": "The prediction question",
  "description": "Clear resolution criteria in 1-2 sentences",
  "category": "politics|crypto|tech|sports|entertainment",
  "options": [{"id": "yes", "text": "Yes"}, {"id": "no", "text": "No"}]
}

For multi-outcome events, use options like:
[{"id": "opt_0", "text": "Option A"}, {"id": "opt_1", "text": "Option B"}, {"id": "opt_2", "text": "Option C"}]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    if (!responseText) {
      return res.status(500).json({ message: 'Groq returned an empty response' });
    }

    // Parse the response — handle both array and {events: [...]} formats
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      // Try to extract JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({ message: 'Failed to parse Groq response', raw: responseText.substring(0, 500) });
      }
    }

    // Normalize: if it's {events: [...]} or {markets: [...]}, extract the array
    let generatedEvents = Array.isArray(parsedData)
      ? parsedData
      : parsedData.events || parsedData.markets || parsedData.predictions || Object.values(parsedData)[0];

    if (!Array.isArray(generatedEvents)) {
      return res.status(500).json({ message: 'Groq response did not contain an array of events' });
    }

    let syncedCount = 0;

// Ensure bot users exist for seeding votes
const botCount = 15;
let bots = await User.find({ username: /^bot_/ });
if (bots.length < botCount) {
  const newBots = [];
  for (let i = bots.length; i < botCount; i++) {
    newBots.push({
      username: `bot_trader_${i + 1}`,
      email: `bot${i + 1}@trendcast.io`,
      password: 'password123',
      role: 'user'
    });
  }
  const createdBots = await User.insertMany(newBots);
  bots = bots.concat(createdBots);
}

let skippedCount = 0;
    

    for (const genEvent of generatedEvents) {
      // Validate required fields
      if (!genEvent.title || !genEvent.options || !Array.isArray(genEvent.options) || genEvent.options.length < 2) {
        skippedCount++;
        continue;
      }

      // Deduplication: check if a similar title already exists
      const normalizedTitle = genEvent.title.toLowerCase().trim();
      const isDuplicate = existingTitles.some(existing => {
        // Exact match
        if (existing === normalizedTitle) return true;
        // Fuzzy match: check if 80%+ of words overlap
        const existingWords = new Set(existing.split(/\s+/));
        const newWords = normalizedTitle.split(/\s+/);
        const overlapCount = newWords.filter(w => existingWords.has(w)).length;
        return overlapCount / Math.max(newWords.length, 1) > 0.8;
      });

      if (isDuplicate) {
        skippedCount++;
        continue;
      }

      // Ensure options have proper id fields
      const options = genEvent.options.map((opt, index) => ({
        id: opt.id || (index === 0 ? 'yes' : index === 1 ? 'no' : `opt_${index}`),
        text: opt.text || opt.name || `Option ${index + 1}`
      }));

      const newEvent = new Event({
        title: genEvent.title,
        description: genEvent.description || genEvent.title,
        options,
        createdBy: req.user._id,
        isActive: true
      });

      await newEvent.save();
       // Seed random votes for the newly created event to simulate live activity
 const voteCount = Math.floor(Math.random() * 8) + 3; // 3-10 votes
 const shuffledBots = [...bots].sort(() => 0.5 - Math.random()).slice(0, voteCount);
 for (const bot of shuffledBots) {
   const existingVote = await Vote.findOne({ user: bot._id, event: newEvent._id });
   if (existingVote) continue;
   const randomOptionIdx = Math.floor(Math.random() * newEvent.options.length);
   const optionId = newEvent.options[randomOptionIdx].id;
   await Vote.create({ user: bot._id, event: newEvent._id, optionId });
 }
 existingTitles.push(normalizedTitle); // Add to dedup list for this batch
      syncedCount++;
    }

      res.status(201).json({
        message: 'Polymarket data synced successfully',
        syncedCount,
        skippedDuplicates: skippedCount,
        totalGenerated: generatedEvents.length
      });
  } catch (error) {
    console.error('Groq Sync Error:', error);
    res.status(500).json({ message: 'Failed to generate events via Groq AI', error: error.message });
  }
};

// Admin CRUD for Votes

// @desc    Get all votes (admin)
// @route   GET /api/admin/votes
// @access  Private/Admin
const adminGetAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vote (admin)
// @route   DELETE /api/admin/votes/:id
// @access  Private/Admin
const adminDeleteVote = async (req, res) => {
  try {
    const vote = await Vote.findByIdAndDelete(req.params.id);
    if (!vote) return res.status(404).json({ message: 'Vote not found' });
    res.json({ message: 'Vote deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin CRUD for Users
// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID (admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const adminGetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const adminUpdateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const adminDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @route   POST /api/admin/seed-activity
// @access  Private/Admin
const seedMockActivity = async (req, res) => {
  try {
    // 1. Ensure we have mock "Bot" users
    const botCount = 15;
    let bots = await User.find({ username: /^bot_/ });

    if (bots.length < botCount) {
      const newBots = [];
      for (let i = bots.length; i < botCount; i++) {
        newBots.push({
          username: `bot_trader_${i + 1}`,
          email: `bot${i + 1}@trendcast.io`,
          password: 'password123',
          role: 'user'
        });
      }
      const createdBots = await User.insertMany(newBots);
      bots = bots.concat(createdBots);
    }

    // 2. Get all active events
    const activeEvents = await Event.find({ isActive: true });
    let totalVotesSeeded = 0;

    // 3. For each event, add random votes from bots
    for (const event of activeEvents) {
      const randomVoteCount = Math.floor(Math.random() * bots.length) + 3;
      const shuffledBots = [...bots].sort(() => 0.5 - Math.random()).slice(0, randomVoteCount);

      for (const bot of shuffledBots) {
        // Check if bot already voted
        const existingVote = await Vote.findOne({ user: bot._id, event: event._id });
        if (existingVote) continue;

        const randomOptionIndex = Math.floor(Math.random() * event.options.length);
        const selectedOption = event.options[randomOptionIndex].id;

        await Vote.create({
          user: bot._id,
          event: event._id,
          optionId: selectedOption
        });
        totalVotesSeeded++;
      }
    }

    res.status(201).json({
      message: 'Mock activity seeded successfully',
      totalVotesSeeded,
      eventsAffected: activeEvents.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove events with 0 predictions
// @route   DELETE /api/admin/cleanup-events
// @access  Private/Admin
const cleanupZeroPredictionEvents = async (req, res) => {
  try {
    const events = await Event.aggregate([
      {
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: 'event',
          as: 'votes'
        }
      },
      {
        $addFields: {
          voteCount: { $size: '$votes' }
        }
      },
      {
        $match: {
          voteCount: 0
        }
      }
    ]);

    const eventIds = events.map(e => e._id);
    const result = await Event.deleteMany({ _id: { $in: eventIds } });

    res.json({
      message: 'Cleanup successful',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  closeEvent,
  syncPolymarketData,
  seedMockActivity,
  cleanupZeroPredictionEvents,
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
};
