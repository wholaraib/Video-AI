import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function dbConnect() {
  if (cached.connection) return cached.connection;
  
  if (!cached.promise) {
   cached.promise = mongoose.connect(MONGODB_URI).then(() => {
      return mongoose.connection;
    }).catch((err) => {
      console.error("MongoDB connection failed:", err);
      cached.promise = null;
      throw err;
    });
  }

try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (err) {
    console.error("MongoDB connection error during await:", err);
    throw err; 
  }
}
