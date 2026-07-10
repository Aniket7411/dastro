import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './src/models/Blog.js';

dotenv.config();

const sampleBlogs = [
  {
    title: 'Understanding Vedic Astrology',
    slug: 'understanding-vedic-astrology',
    excerpt: 'Learn the foundations of Vedic astrology and how birth charts reveal life patterns.',
    content: '<p>Vedic astrology, or Jyotish, is an ancient Indian system that maps planetary positions at birth to understand personality, karma, and life events.</p><p>Your birth chart (kundli) is the starting point for deeper self-awareness and timing important decisions.</p>',
    category: 'Vedic Astrology',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
    tags: ['astrology', 'vedic', 'kundli'],
    isPublished: true,
  },
  {
    title: 'Tarot for Beginners: A Simple Guide',
    slug: 'tarot-for-beginners',
    excerpt: 'New to tarot? Start here with spreads, card meanings, and daily practice tips.',
    content: '<p>Tarot is a reflective tool for insight—not fortune telling. Begin with a single-card daily draw and journal what resonates.</p><p>The Major Arcana represents life lessons; the Minor Arcana reflects everyday situations.</p>',
    category: 'Tarot',
    image: 'https://images.unsplash.com/photo-1509248961150-0b0e0a0b0b0b?w=800',
    tags: ['tarot', 'beginners'],
    isPublished: true,
  },
  {
    title: 'Numerology and Your Life Path Number',
    slug: 'numerology-life-path-number',
    excerpt: 'Discover how your birth date reveals your core strengths and life purpose.',
    content: '<p>Life Path numbers are calculated from your full birth date and describe your natural talents and challenges.</p><p>Each number from 1 to 9 (plus master numbers 11, 22, 33) carries a unique vibration.</p>',
    category: 'Numerology',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    tags: ['numerology', 'life-path'],
    isPublished: true,
  },
];

const seedBlogs = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  let created = 0;
  for (const blog of sampleBlogs) {
    const exists = await Blog.findOne({ slug: blog.slug });
    if (exists) {
      if (!exists.isPublished) {
        exists.isPublished = true;
        await exists.save();
        console.log(`Published existing draft: ${blog.slug}`);
      } else {
        console.log(`Skipped (exists): ${blog.slug}`);
      }
      continue;
    }
    await Blog.create(blog);
    created++;
    console.log(`Created: ${blog.slug}`);
  }

  const published = await Blog.countDocuments({ isPublished: true });
  console.log(`Done. ${created} new blog(s). Total published: ${published}`);
  await mongoose.disconnect();
};

seedBlogs().catch((err) => {
  console.error(err);
  process.exit(1);
});
