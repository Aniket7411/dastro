const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://astroadmin:AstroDb%402026%2523@cluster0.ijwtdc4.mongodb.net/astrology?retryWrites=true&w=majority')
  .then(async () => {
    const db = mongoose.connection.db;
    await db.collection('courses').updateOne(
      { _id: new mongoose.Types.ObjectId('6a211785a2785e43dc27a43f') },
      { $set: { price: 499 } }
    );
    console.log('Price updated to 499');
    process.exit(0);
  });
