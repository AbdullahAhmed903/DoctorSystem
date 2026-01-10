// db.js
import mongoose from "mongoose";
import dbConfig from "./db-config.js";


mongoose.set('strictQuery', false); // optional, suppress warnings

// Using a function to connect to the database
// const connectDB = async () => {
//   try {
//     await mongoose.connect(`${dbConfig.url}`);
//     console.log("✅ Connected to the database!");
//   } catch (err) {
//     console.error("❌ Cannot connect to the database!", err);
//     process.exit(1); // exit with failure
//   }
// };

// export default connectDB;


// Using a class to manage the connection
// Singleton pattern to ensure single connection instance
class connectiondb {
  constructor() {
    if (connectiondb.instance) return connectiondb.instance;
    this.connect();
    connectiondb.instance = this;
  }

  async connect() {
    try {
      await mongoose.connect('mongodb+srv://DoctorSystem:01090524452@cluster0.fjnrf7u.mongodb.net/doctorsystem');
      console.log("✅ Connected to the database!");
    } catch (err) {
      console.error("❌ Cannot connect to the database!", err);
      process.exit(1); // exit with failure
    }
  }
}

export default connectiondb;
