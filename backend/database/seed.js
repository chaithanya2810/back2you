require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../database/connect");
const User = require("../models/User");

const seed = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected!");

    // Clear old data
    await User.deleteMany({});

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("123456", 10);

    // Create admin + test users
    await User.create([
      {
        name: "Admin",
        email: "admin@back2you.com",
        passwordHash: adminPassword,
        role: "admin"
      },
      {
        name: "Test User 1",
        email: "user1@example.com",
        passwordHash: userPassword,
        role: "user"
      },
      {
        name: "Test User 2",
        email: "user2@example.com",
        passwordHash: userPassword,
        role: "user"
      }
    ]);

    console.log("Seed data inserted successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
