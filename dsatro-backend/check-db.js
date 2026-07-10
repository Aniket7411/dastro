import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Enrollment from './src/models/Enrollment.js';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const enrollments = await Enrollment.find();
    const users = await User.find();
    
    await Enrollment.updateMany({}, { $set: { isActive: true } });
    console.log('Fixed old enrollments to be active.');
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
  