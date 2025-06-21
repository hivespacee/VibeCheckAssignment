import mongoose from "mongoose";
import User from "../models/User.js";
import Vibe from "../models/Vibe.js";
const connectDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI); 
        console.log("MongoDB Connected Successfully ");
    }
    catch(error){
        console.log(error)
        process.exit(1);
    }
}
export default connectDB;