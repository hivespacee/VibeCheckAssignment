import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    quote : { type : String , required : true },
    likedByUserId : { type : mongoose.Schema.Types.ObjectId , ref: "User"},
    likedByUserName : {type:String, required:true},
    likedVibe : { type : mongoose.Schema.Types.ObjectId , ref: 'Vibe'}
});

export default mongoose.model('Comment',commentSchema);