const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ogms')
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    console.log('\nAvailable databases:');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // List collections in ogms database
    try {
      const collections = await db.listCollections().toArray();
      console.log(`\nCollections in 'ogms' database: ${collections.length}`);
      
      if (collections.length > 0) {
        for (const collection of collections) {
          const count = await db.collection(collection.name).countDocuments();
          console.log(`- ${collection.name}: ${count} documents`);
        }
      } else {
        console.log('No collections found. Database might be empty.');
      }
    } catch (error) {
      console.log('Error accessing collections:', error.message);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(error => {
    console.error('Connection error:', error);
    process.exit(1);
  });
