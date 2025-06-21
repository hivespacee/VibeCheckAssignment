import Vibe from "../models/Vibe.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addVibe = async (req,res) => {
    try{
        const { vibeText, mood }=req.body;
        const userId = req.user.id;
        const newVibe= await Vibe.create({vibeText,mood,user:userId});
        res.status(201).json(newVibe);
    }
    catch(error){
        return res.status(500).json({error : "Kuch Hogaya hai"})
    }
}


export const gettingSpecificUserVibes = async (req,res)=>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({error : "Token not found !!!"})
        }
        const profile = await User.findById(userId); // returns a single document
        const VibesObject = await Vibe.find({ user: userId }); // array of vibes

        const mergeObj = VibesObject.map(vibeObj => ({
        vibeText: vibeObj.vibeText,
        mood: vibeObj.mood
        }));

        res.status(201).json({mergeObj});
    }
    catch(error){
        return res.status(500).json({error : "Server went missing !!!"});
    }
}

export const gettingAllVibes = async(req,res)=>{
    try{
        const allVibes = await Vibe.find()
        .populate('user','username');
        res.status(201).json(allVibes);
    }
    catch{
        return res.status(500).json({error:"Server Down Down Dappa !!!!!"})
    }
}

export const likingVibe = async(req,res)=>{
    try{
        const vibeId=req.params.id;
        const vibeDetails = await Vibe.findById(vibeId)
        .populate('user','username')
        .populate('liked',"username");
        if(!vibeDetails){
            return res.status(404).json({error : "Vibe not found !!!"})
        }
        const likeStatus = await Vibe.findOne({ _id:vibeId ,liked :req.user.id})
        console.log(vibeDetails);
        if(!likeStatus){
            await Vibe.updateOne(
                {_id : vibeId},
                {$addToSet:{liked:req.user.id}}
            );
            return res.status(201).json({message : "Liked Successfully"});
        }
        else{
            await Vibe.updateOne(
                { _id : vibeId},
                {$pull : {liked: req.user.id}}
            );
            return res.status(200).json({message : "UnLiked Successfully"});
        }
    }
    catch(error){
        return res.status(500).json({error : "Wait, lets bring server back "});
    }
}
export const commentVibe = async(req,res)=>{
    try{
        const vibeId = req.params.id;
        const {comment : commentDetails} =  req.body;
        const user = req.user
        const vibeDetails= await Vibe.findById(vibeId).populate('user','username');
        if(!vibeDetails){
            return res.status(404).json({ error : "Sorry there is no vibe with entered ID "})
        }
        const newComment = await Comment.create({ 
            quote :commentDetails,
            likedByUserId :req.user.id ,
            likedByUserName :req.user.name , 
            likedVibe : vibeId 
        })
        await newComment.save();
        return res.status(201).json({message : "Comment Received Successfully"});
    }
    catch(error){
        return res.status(500).json({error : "Sorry to disturb while commenting, server crashed"});
    }
}
export const getCommentedVibe = async(req,res)=>{
    try{
        const vibeId = req.params.id;
        const vibeDetails= await Vibe.findById(vibeId);
        if(!vibeDetails){
            return res.status(404).json({ error : "Sorry there is no vibe with entered ID "})
        }
        const allVibes = await Comment.find({likedVibe : vibeId})
        return res.status(200).json({allVibes});
    }
    catch(error){
        return res.status(500).json({error : "Sorry to disturb while commenting, server crashed"});
    }
}

export const getComments = async(req,res)=>{
    try{
        const totalComments = await Comment.find({}); 
        // const res= totalComments.map( obj=>({
        //     quote : obj.quote ,
        //     likedByUserName : obj.likedByUserName ,
        //     likedByUserId : obj.likedByUserId,
        //     likedVibe : obj.likedVibe
        // }));
        return res.status(201).json({totalComments});
    }
    catch(error){
        return res.status(500).json({error : "Sorry to disturb while fetching comments, its's a Server Isssue"})
    }
}

export const gettingAllFollowedVibes = async(req,res)=>{
    try{
        const userId = req.user.id;
        const users = await User.findById(userId);
        if(!users){
            return res.status(400).json({message :"Sorry no users found"});
        }
        const followingUsers = users.following.map( i => {
            return i._id;
        }) 
        const followedUsers = users.followers.map(i => {
            return  i._id;
        });
        const allFollowedVibes = await Vibe.find({user : {$in : followingUsers}}).populate('user','username');
        const allFollowedVibes1 = await Vibe.find({user : {$in : followedUsers}}).populate('user','username');
        const finalResult = [...allFollowedVibes, ...allFollowedVibes1];
        res.status(201).json(finalResult);
    }
    catch{
        return res.status(500).json({error:"Server Down Down Dappa !!!!!"})
    }
}
