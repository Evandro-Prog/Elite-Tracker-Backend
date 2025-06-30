import mongoose from 'mongoose';

const { DATABASE_URL: databaseUrl } = process.env;

export async function setupMongo() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    console.log('🎲 Connecting to database.....');
    await mongoose.connect(String(databaseUrl), {
      serverSelectionTimeoutMS: 3000,
    });

    console.log('☑ Database connected!!');
  } catch (error) {
    throw new Error('❌ Database not connected...');
  }
}
