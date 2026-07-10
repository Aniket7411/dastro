import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedCatalogFromStaticIfEmpty } from './src/services/consultationCatalogDb.js';

dotenv.config();
console.log("test")
const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  const result = await seedCatalogFromStaticIfEmpty();
  console.log(result.seeded ? `Seeded ${result.count} services` : `Already seeded (${result.count} services)`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
