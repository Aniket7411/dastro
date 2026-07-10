import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import CourseVideo from './src/models/CourseVideo.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Insert admin user
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash,
        role: 'admin'
      });
      console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Insert test course and video
    const existingCourse = await Course.findOne({ title: 'Test Astrology Course' });
    if (!existingCourse) {
      const course = await Course.create({
        title: 'Test Astrology Course',
        description: 'This is a test course created during Phase 2 setup.',
        price: 999,
        validityDays: 365,
        thumbnailUrl: 'https://via.placeholder.com/150',
        isActive: true
      });

      await CourseVideo.create({
        courseId: course._id,
        title: 'Introduction Video',
        bunnyVideoId: 'dummy-bunny-video-id',
        sortOrder: 1
      });
      console.log('Test course and video created.');
    } else {
      console.log('Test course already exists.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
