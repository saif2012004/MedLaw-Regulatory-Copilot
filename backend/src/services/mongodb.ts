import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set. Skipping Mongo connection (dev mode).');
    return;
  }
  await mongoose.connect(uri, { dbName: 'medlaw' });
  isConnected = true;
  console.log('? Connected to MongoDB');
}

export default mongoose;
