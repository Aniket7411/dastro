import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Course from './src/models/Course.js';
import CourseVideo from './src/models/CourseVideo.js';
import Enrollment from './src/models/Enrollment.js';

dotenv.config();

const seedStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    // 1. Find or Create a Test Course
    let course = await Course.findOne({ title: 'Vedic Astrology Foundation' });
    if (!course) {
      course = await Course.create({
        title: 'Vedic Astrology Foundation',
        description: 'Complete basics to advanced prediction',
        price: 15000,
        validityDays: 180,
        thumbnailUrl: '/images/vedic_thumbnail.png'
      });
    }

    // 2. Add a dummy video to the course if none exist
    let video = await CourseVideo.findOne({ courseId: course._id });
    if (!video) {
      video = await CourseVideo.create({
        courseId: course._id,
        title: 'Introduction to Houses',
        bunnyVideoId: 'dummy_video_id_for_testing',
        sortOrder: 1
      });
    }

    // 3. Create a Dummy Student
    const studentEmail = 'student@example.com';
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      student = await User.create({
        name: 'Test Student',
        email: studentEmail,
        passwordHash: hashedPassword,
        role: 'student'
      });
    }

    // 4. Enroll Student in Course
    const existingEnrollment = await Enrollment.findOne({ userId: student._id, courseId: course._id });
    if (!existingEnrollment) {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + course.validityDays);

      await Enrollment.create({
        userId: student._id,
        courseId: course._id,
        validUntil,
        isActive: true,
        progress: { completedVideos: [] }
      });
    }

    console.log('✅ Success! Test student created: student@example.com / student123');
    console.log('✅ Student is enrolled in:', course.title);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedStudent();
