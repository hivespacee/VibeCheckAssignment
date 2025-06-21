import User from "../models/User.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import {loginUserSchema,registerUserSchema} from "../validators/authValidators.js";

export const registerUser = async(req,res)=>{
    try{
        const {data,error} = registerUserSchema.safeParse(req.body);
        if(error){
            return res.status(400).json({message: {"Error Aaagaya ": error.message}});
        }
        const {username,email,password} = data;
        const existingUser=await User.findOne({username});
        const existingEmail= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message :"Username already exists"});
        }
        else if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }
        else if(!validator.isLength(password,{min:3})){
            return res.status(400).json({message: "Write something longer than 3 charcaters"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser= await User.create({username,email,password:hashedPassword});
        await newUser.save();

        const payLoad={user:{name: newUser.name , id: newUser.id}}
        const token=jwt.sign(payLoad,process.env.JWT_URI,{expiresIn : "1h"});
        console.log(`User ${username} is created successfully`);
        res.status(201).json({token,message:"User created successfully"});
        }
    catch(error){
        console.log(error.message);
        res.status(500).json({error : " Its our fault, we are resolving it !!!!"})
    }
}


export const loginUser = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const person = await User.findOne({ email }).select("+password");
        if(!person){
            return res.status(400).json({message :"Sorry Wrong Email Address or I think you need to register yourself"});
        }
        const isMatch = await bcrypt.compare(password,person.password);
        if(!isMatch){
            return res.status(401).json({message :"Sorry your password is incorrect"});
        }
        const payLoad={user:{name:person.username, id:person.id}}
        const token = jwt.sign(payLoad,process.env.JWT_URI,{expiresIn:"1h"});
        console.log(`Wooohooo ${person.username}, you are logged in`);
        res.status(201).json({token, person:{name:person.username, email:person.email}});
        }
    catch(error){
        res.status(500).json({error: "An Unexpected Error has occured we are trying to resolve it...." });
    }
}

export const allUsers = async(req,res)=>{
    try{
        const users = await User.find({})
        // .select('username email');
        // console.log(users);
        if(!users){
            return res.status(400).json({message :"Sorry no users found"});
        }
        res.status(200).json(users);
    }
    catch(error){

    }
}

export const followUser = async (req,res)=>{
    try{
        const pointerUserId = req.params.id;
        const myUserId = req.user.id;
        const myUserName = req.user.name;
        console.log(myUserName);
        const pointerUser = await User.findById(pointerUserId);
        const pointerUserName  = pointerUser.username;
        const userMyself = await User.findById(myUserId);
        if(!pointerUser){
            return res.status(400).json({message :"Sorry user not found"});
        }
        // updating the following array of the user who is logged in
        
        const followStatus = await User.findOne({ _id : myUserId , "following._id" :pointerUserId })
        const followStatus2 = await User.findOne({ _id : pointerUserId , "followers._id" : myUserId });

        if(followStatus && followStatus2){
            await User.updateOne(
                {_id : myUserId },
                {$pull : {following :{_id:pointerUserId}}}
            )
            await User.updateOne(
                {_id : pointerUserId},
                { $pull : {followers : {_id:myUserId}} }
            )
            // console.log(followStatus);
            return res.status(200).json({message :"You have unfollowed this user"});
        }
        else{
            await User.updateOne(
                {_id : myUserId },
                {$addToSet : {following : {_id : pointerUserId, username : pointerUserName }}}
            )
            await User.updateOne(
                {_id : pointerUserId},
                { $addToSet : {followers : { _id : myUserId, username : myUserName }} }
            )
            // console.log(followStatus);
            return res.status(200).json({message :"You have followed this user"});
        }

    }
    catch(error){
        return res.status(500).json({error: "Wait for sometime we are resolving it..." })
    }
}