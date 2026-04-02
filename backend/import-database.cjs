const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/grocery_store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Import collections from JSON
const importCollections = async () => {
  try {
    const db = mongoose.connection.db;
    const backupDir = path.join(__dirname, 'database-backup');
    
    if (!fs.existsSync(backupDir)) {
      console.error('❌ Backup directory not found:', backupDir);
      console.log('Please make sure the database-backup folder exists with JSON files.');
      return;
    }
    
    // Get all JSON files in backup directory
    const files = fs.readdirSync(backupDir).filter(file => file.endsWith('.json'));
    
    console.log('Found backup files:', files);
    
    // Import each collection
    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      const filePath = path.join(backupDir, file);
      
      console.log(`\n📥 Importing ${collectionName}...`);
      
      // Read JSON data
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);
      
      if (data.length === 0) {
        console.log(`⚠️  No data found in ${file}`);
        continue;
      }
      
      // Drop existing collection
      await db.collection(collectionName).drop().catch(() => {
        console.log(`Collection ${collectionName} didn't exist, creating new one...`);
      });
      
      // Insert data
      await db.collection(collectionName).insertMany(data);
      
      console.log(`✅ Imported ${data.length} documents into ${collectionName}`);
    }
    
    console.log('\n🎉 Database import completed successfully!');
    console.log('\n📊 Imported collections:');
    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   - ${collectionName}: ${count} documents`);
    }
    
  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the import
const main = async () => {
  await connectDB();
  await importCollections();
  process.exit(0);
};

main();
