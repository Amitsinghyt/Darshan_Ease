const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');
const Temple = require('./models/Temple');
const DarshanSlot = require('./models/DarshanSlot');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seed = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Temple.deleteMany();
    await DarshanSlot.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Master Admin',
      email: 'admin@darshan.com',
      phone: '1234567890',
      password: 'password123',
      role: 'Admin'
    });

    // Create Organizer
    const organizer = await User.create({
      name: 'Temple Organizer',
      email: 'organizer@temple.com',
      phone: '0987654321',
      password: 'password123',
      role: 'Organizer'
    });

    // Read the dynamically generated temple data with real Wikipedia images
    const rawData = fs.readFileSync('templeDataLocal.json');
    const templesWithImages = JSON.parse(rawData);

    const mappedTemples = templesWithImages.map((t) => ({
      templeName: t.templeName,
      location: t.location,
      darshanStartTime: '06:00',
      darshanEndTime: '21:00',
      description: `The sacred ${t.templeName} located in ${t.location}. A beautiful place of worship and spiritual peace.`,
      image: t.image,
    }));

    const createdTemples = await Temple.insertMany(mappedTemples);

    // Create Sample Slots for the first 3 temples so we have some active booking options available
    for (let i = 0; i < 3; i++) {
        const today = new Date();
        await DarshanSlot.create({
          templeId: createdTemples[i]._id,
          date: new Date(today.setDate(today.getDate() + 1)),
          startTime: '08:00',
          endTime: '09:00',
          availableSeats: 50,
          price: 151
        });

        await DarshanSlot.create({
          templeId: createdTemples[i]._id,
          date: new Date(today.setDate(today.getDate() + 1)),
          startTime: '10:00',
          endTime: '11:00',
          availableSeats: 120,
          price: 101
        });
    }

    console.log('Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seed();
