import mongoose from "mongoose";

const vibeSchema = new mongoose.Schema({
    mood:String,
    vibeText:String, 
    liked : [ {type: mongoose.Schema.Types.ObjectId, ref:'User'} ],
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    createdAt:{ type:Date, default:Date.now }
})

export default mongoose.model('Vibe', vibeSchema);