import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AstroMeta from './src/models/AstroMeta.js';

dotenv.config();

const MOON_PHASES = [
  { key: "1", data: { name: "New Moon", title: "The Visionary", keywords: ["Internalization", "Emergence", "Renewal"] } },
  { key: "2", data: { name: "Waxing Crescent", title: "The Explorer", keywords: ["Expansion", "Growth", "Struggle"] } },
  { key: "3", data: { name: "First Quarter", title: "The Builder", keywords: ["Action", "Commitment", "Construction"] } },
  { key: "4", data: { name: "Waxing Gibbous", title: "The Achiever", keywords: ["Analysis", "Expectancy", "Finality"] } },
  { key: "5", data: { name: "Full Moon", title: "The Catalyst", keywords: ["Fulfillment", "Integration", "Clarity"] } },
  { key: "6", data: { name: "Waning Gibbous", title: "The Teacher", keywords: ["Demonstration", "Instruction", "Sharing"] } },
  { key: "7", data: { name: "Last Quarter", title: "The Reformer", keywords: ["Release", "Courage", "Change"] } },
  { key: "8", data: { name: "Balsamic Moon", title: "The Healer", keywords: ["Release", "Completion", "Transition"] } }
];

const NUMEROLOGY_DATA = [
  { key: "1", data: { planet: "Sun", sign: "Leo", stones: "Ruby", days: "Sunday", color: "Orange", god: "Surya", mantra: "ॐ सूर्याय नमः" } },
  { key: "2", data: { planet: "Moon", sign: "Cancer", stones: "Pearl", days: "Monday", color: "White", god: "Devi Durga", mantra: "ॐ चन्द्राय नमः" } },
  // ... and so on
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/astrology");
    console.log("Connected to DB...");

    await AstroMeta.deleteMany({}); // Reset

    const moonDocs = MOON_PHASES.map(m => ({ type: 'moon_phase', ...m }));
    const numDocs = NUMEROLOGY_DATA.map(n => ({ type: 'radical_num', ...n }));

    await AstroMeta.insertMany([...moonDocs, ...numDocs]);
    console.log("✅ Seeded dynamic metadata to Database");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
