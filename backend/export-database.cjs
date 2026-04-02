const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ogms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Export collections to JSON
const exportCollections = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Found collections:', collections.map(c => c.name));
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, 'database-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Export each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Exporting ${collectionName}...`);
      
      const data = await db.collection(collectionName).find({}).toArray();
      const filePath = path.join(backupDir, `${collectionName}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${data.length} documents from ${collectionName}`);
    }
    
    console.log('\n🎉 Database export completed successfully!');
    console.log(`📁 Backup files saved to: ${backupDir}`);
    console.log('\n📋 Files created:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}.json`);
    });
    
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the export
const main = async () => {
  await connectDB();
  await exportCollections();
  process.exit(0);
};

main();
