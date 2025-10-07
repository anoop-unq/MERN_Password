// fixIndex.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('Connected to MongoDB');

    // Get the collection properly
    const collection = mongoose.connection.db.collection('users');
    
    console.log('📋 Checking current indexes...');
    
    // Get current indexes (correct method)
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(index => index.name));

    // Check if username index exists and drop it
    const usernameIndex = indexes.find(index => index.name === 'username_1');
    
    if (usernameIndex) {
      console.log('🚫 Found problematic username_1 index, dropping...');
      await collection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } else {
      console.log('✅ No username_1 index found (good!)');
    }

    // Verify indexes after fix
    console.log('📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    console.log(finalIndexes.map(index => index.name));

    console.log('🎉 Database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
    
    // Handle specific errors
    if (error.codeName === 'IndexNotFound') {
      console.log('ℹ️ Index already removed');
    }
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixIndex();