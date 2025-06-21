    import mongoose from 'mongoose';
    import z from "zod";

    const userSchema =  new mongoose.Schema({
        username: { type:String, required:true, unique:true },
        following : [{
            _id : {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            username : String 
        }],
        followers : [{
            _id : {type:mongoose.Schema.Types.ObjectId, ref:'User'},
            username : String 
        }],
        email: { type:String, required:true, unique:true },
        password: { type:String, required:true}
    });

    const User= mongoose.model("User", userSchema);

    export default User;