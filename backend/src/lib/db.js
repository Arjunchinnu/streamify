import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connected", conn.connection.host);
  } catch (err) {
    console.log("error in mongo connection", err);
    process.exit(1);
  }
};

export default connectdb;
