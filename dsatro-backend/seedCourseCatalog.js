import mongoose from 'mongoose';
import Course from './src/models/Course.js';
import CourseCategory from './src/models/CourseCategory.js';
import { uniqueSlug } from './src/utils/slugify.js';
import './src/config/env.js';

const DEFAULT_CATEGORIES = [
  { name: 'Vedic Astrology', slug: 'vedic-astrology' },
  { name: 'Tarot', slug: 'tarot' },
  { name: 'Numerology', slug: 'numerology' },
  { name: 'Palmistry', slug: 'palmistry' },
];

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  for (const cat of DEFAULT_CATEGORIES) {
    const exists = await CourseCategory.findOne({ slug: cat.slug });
    if (!exists) {
      await CourseCategory.create({ ...cat, sortOrder: 0, isActive: true });
      console.log('Created category:', cat.name);
    }
  }

  const courses = await Course.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
  for (const course of courses) {
    course.slug = await uniqueSlug(Course, course.title, course._id);
    if (!course.category) course.category = 'Astrology';
    await course.save();
    console.log('Backfilled slug:', course.slug, '—', course.title);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
