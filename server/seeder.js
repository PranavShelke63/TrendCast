const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Vote = require('./models/Vote');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin'
  },
  {
    username: 'john',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'jane',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Event.deleteMany();
    await Vote.deleteMany();

    // Use a loop to trigger the 'save' middleware (password hashing)
    const createdUsers = [];
    for (const u of users) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    const adminUser = createdUsers[0]._id;

    const events = [
      {
        title: 'Will the Federal Reserve cut interest rates in June 2026?',
        description: 'This market resolves to Yes if the US Federal Reserve announces a cut to the federal funds target rate during their June 2026 FOMC meeting.',
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: adminUser
      },
      {
        title: 'Who will win the 2026 FIFA World Cup?',
        description: 'Predict the winner of the 2026 FIFA World Cup hosted by USA, Canada, and Mexico.',
        options: [{ id: 'bra', text: 'Brazil' }, { id: 'fra', text: 'France' }, { id: 'arg', text: 'Argentina' }, { id: 'eng', text: 'England' }],
        createdBy: adminUser
      },
      {
        title: 'Will Bitcoin reach $150,000 by end of 2026?',
        description: 'This market resolves to Yes if the price of Bitcoin (BTC) hits $150,000 USD on Binance at any point before Dec 31, 2026.',
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: adminUser
      },
      {
        title: 'Will OpenAI release GPT-5 before July 2026?',
        description: 'This market resolves to Yes if OpenAI officially releases a model named "GPT-5" to the public before July 1, 2026.',
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: adminUser
      },
      {
        title: 'Will humans land on Mars by 2030?',
        description: 'This market resolves to Yes if any human crew lands on the surface of Mars before January 1, 2030.',
        options: [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }],
        createdBy: adminUser
      }
    ];

    const createdEvents = await Event.insertMany(events);

    // Simulate random votes
    const votes = [];
    createdUsers.forEach(user => {
      createdEvents.forEach(event => {
        // Each user has 70% chance of voting on each event
        if (Math.random() > 0.3) {
          const randomOption = event.options[Math.floor(Math.random() * event.options.length)];
          votes.push({
            user: user._id,
            event: event._id,
            optionId: randomOption.id
          });
        }
      });
    });

    await Vote.insertMany(votes);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
